/* eslint-disable @typescript-eslint/camelcase */
import { TiempoRepository, UsuarioRepository, ProyectoRepository, IssueRepository } from "../repositories";
import { repository, Filter } from "@loopback/repository";
import { get, getModelSchemaRef, param, getFilterSchemaFor } from "@loopback/rest";
import { Tiempo } from "../models/tiempo.model";
import { Usuario } from '../models';
import moment from 'moment-with-locales-es6';
import { format } from "path";

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


export class TiempoController {
  constructor(
    @repository(TiempoRepository)
    public tiempoRepository: TiempoRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(IssueRepository)
    public issueRepository: IssueRepository,
    @repository(ProyectoRepository)
    public proyectoRepository: ProyectoRepository,
  ) { }

  @get('/tiempos', {
    responses: {
      '200': {
        description: 'Array of Tiempo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Tiempo, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Tiempo)) filter?: Filter<Tiempo>,
  ): Promise<{}> {

    const listaTiempos = await this.tiempoRepository.find(filter);

    return {
      statusCode: 200,
      response: listaTiempos
    }
  }



  @get('/horas/{usuario_id}/{fecha_inicio}/{fecha_fin}', {
    responses: {
      '200': {
        description: 'Tiempo User id model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tiempo, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findByUser(
    @param.path.number('usuario_id') usuario_id: number,
    @param.path.string('fecha_inicio') fecha_inicio: string,
    @param.path.string('fecha_fin') fecha_fin: string,
    // @param.query.object('filter', getFilterSchemaFor(Tiempo)) filter?: Filter<Tiempo>
  ): Promise<{}> {

    const fechaInicio = moment.utc(fecha_inicio).format('YYYY-MM-DD');
    const fechaFin = moment.utc(fecha_fin).format('YYYY-MM-DD');

    const usuarios = await this.tiempoRepository.find({
      where: { usuario_id: usuario_id },
    });

    const usuarioDetail = await this.usuarioRepository.find({
      where: { id: usuario_id },
    });

    const dataUsuario = usuarioDetail.map(item => {
      return {
        id: item.id,
        username: item.username,
        nombre: item.nombre,
        apellido: item.apellido,
      }
    });


    const users = usuarios.filter(item => {
      const itemFecha = moment.utc(item.fecha).format('YYYY-MM-DD');
      return (
        itemFecha >= fechaInicio && itemFecha <= fechaFin
      )
    });

    let tiempoTotal = moment('00:00:00', 'HH:mm:ss');
    const detalleLogs = users.map(item => {
      const horaIni = moment(item.hora_inicio, "HH:mm:ss");
      const horaFin = moment(item.hora_fin, "HH:mm:ss");
      const diff = horaFin.diff(horaIni);

      tiempoTotal = tiempoTotal + diff;
      return {
        horasTrabajadas: moment.utc(diff).format("HH:mm"),
        issue_id: item.issue_id
      }
    });

    tiempoTotal = moment(tiempoTotal).format('HH:mm');

    const detalleLogsSum: any[] = [];
    const issuesIds: number[] = [];
    detalleLogs.forEach(item => {
      const issue = item.issue_id;
      const indexIssue = issuesIds.indexOf(issue);
      if (indexIssue === -1) {
        detalleLogsSum.push(item)
        issuesIds.push(issue);
      } else {
        let indexDetail = 0;
        let time = '';
        detalleLogsSum.forEach((el, idx) => {
          if (el.issue_id === issue) {
            indexDetail = idx;
            time = el.horasTrabajadas
          }
        })
        time = moment(time, "HH:mm") + moment.utc(item.horasTrabajadas, "HH:mm")
        time = moment(time).format("HH:mm");
        detalleLogsSum.splice(indexDetail, 1)
        detalleLogsSum.push({ horasTrabajadas: time, issue_id: issue })
      }
    })

    const issuesList = await this.issueRepository.find({
      where: {
        id: {
          inq: issuesIds
        },
      },
    });
    const proyectosIds = issuesList.map(item => item.proyecto_id)

    detalleLogsSum.forEach((item, idx) => {
      const issueId = item.issue_id;
      issuesList.forEach(is => {
        if (issueId === is.id) {
          detalleLogsSum[idx].proyecto_id = is.proyecto_id;
        }
      })
    })

    const proyectosList = await this.proyectoRepository.find({
      where: {
        id: {
          inq: proyectosIds
        },
      },
    });

    const proyectos = detalleLogsSum.map(item => {
      const proyectId = item.proyecto_id;
      let proyecItem = {};
      proyectosList.forEach(pl => {
        if (proyectId === pl.id) {
          proyecItem = { horasTrabajadas: item.horasTrabajadas, nombreProyecto: pl.nombre };
        }
      })
      return proyecItem;
    })

    return {
      statusCode: 200,
      user: dataUsuario,
      tiempoTotal,
      proyectos
    };
  }

  @get('/tiempos/{fecha_inicio}/{fecha_fin}', {
    responses: {
      '200': {
        description: 'tiempo total por usuario',
        content: {
          'application/json': {
            schema: {
              type: 'array',
            },
          },
        },
      },
    },
  })
  async findTiempos(
    @param.path.string('fecha_inicio') fecha_inicio: string,
    @param.path.string('fecha_fin') fecha_fin: string,
    @param.query.object('filter', getFilterSchemaFor(Usuario)) filter?: Filter<Usuario>,
  ): Promise<{}> {
    const fechaInicio = moment.utc(fecha_inicio).format('YYYY-MM-DD');
    const fechaFin = moment.utc(fecha_fin).format('YYYY-MM-DD');

    const usuarios = await this.usuarioRepository.find(filter);
    const userIds = usuarios.map(item => item.id);

    const timeposList = await this.tiempoRepository.find({
      where: {
        usuario_id: {
          inq: userIds
        },
      },
    });

    const tiemposFiltrados = timeposList.filter(item => {
      const itemFecha = moment.utc(item.fecha).format('YYYY-MM-DD');
      return (
        itemFecha >= fechaInicio && itemFecha <= fechaFin
      )
    });

    const duration = tiemposFiltrados.map(item => {
      const horaIni = moment(item.hora_inicio, "HH:mm:ss");
      const horaFin = moment(item.hora_fin, "HH:mm:ss");

      const diff = horaFin.diff(horaIni);
      return {
        horasTrabajadas: moment.utc(diff).format("HH:mm"),
        usuario_id: item.usuario_id
      }
    })

    const detalleDuration: any[] = [];
    const userIdsList: number[] = [];
    duration.forEach(item => {
      const user = item.usuario_id;
      const indexUser = userIdsList.indexOf(user);
      if (indexUser === -1) {
        detalleDuration.push(item)
        userIdsList.push(user);
      } else {
        let indexDetail = 0;
        let time = '';
        detalleDuration.forEach((el, idx) => {
          if (el.usuario_id === user) {
            indexDetail = idx;
            time = el.horasTrabajadas
          }
        })
        time = moment(time, "HH:mm") + moment.utc(item.horasTrabajadas, "HH:mm")
        time = moment(time).format("HH:mm");
        detalleDuration.splice(indexDetail, 1)
        detalleDuration.push({ horasTrabajadas: time, usuario_id: user })
      }
    })

    const listaUsuarios = usuarios.map(userItem => {
      const idUser = userItem.id;
      let response = {};
      detalleDuration.forEach(dur => {
        if (idUser === dur.usuario_id) {
          response = { horasTrabajadas: dur.horasTrabajadas, nombreUsuario: userItem.nombre }
        }
      })
      if (Object.keys(response).length === 0) {
        response = { horasTrabajadas: 0, nombreUsuario: userItem.nombre }
      }
      return response;
    })

    return {
      statusCode: 200,
      response: {
        listaUsuarios,
      }
    };
  }
}
