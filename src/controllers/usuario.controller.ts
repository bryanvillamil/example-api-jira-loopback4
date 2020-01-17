/* eslint-disable @typescript-eslint/camelcase */
import {
  Filter,
  repository,
  IsolationLevel,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Usuario } from '../models';
import { UsuarioRepository, TiempoRepository } from '../repositories';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(TiempoRepository)
    public tiempoRepository: TiempoRepository,
  ) { }

  @post('/usuarios', {
    responses: {
      '200': {
        description: 'el usuario fue creado correctamente',
        content: { 'application/json': { schema: getModelSchemaRef(Usuario) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<{}> {

    const username = usuario.username;

    const usernameExist = await this.usuarioRepository.find({
      where: { username },
    });

    if (usernameExist.length) {
      return {
        statusCode: 403,
        response: 'The user already created',
      }
    }

    await this.usuarioRepository.create(usuario);
    return {
      statusCode: 200,
      response: 'The user was created correctly',
    }
  }

  @get('/usuarios', {
    responses: {
      '200': {
        description: 'Lista de Usuarios',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Usuario, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
  ): Promise<{}> {
    const listUsuarios = await this.usuarioRepository.find();

    return {
      statusCode: 200,
      response: listUsuarios,
    }
  }

  @get('/usuarios/{id}', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usuario, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Usuario)) filter?: Filter<Usuario>
  ): Promise<{}> {

    const tx = await this.usuarioRepository.beginTransaction(IsolationLevel.READ_COMMITTED);

    try {
      const user = await this.usuarioRepository.findById(id, filter, { transation: tx });
      await tx.commit();
      return {
        statusCode: 200,
        response: {
          username: user.username,
          nombre: user.nombre,
          apellido: user.apellido,
        }
      }
    } catch (error) {
      await tx.rollback();
      return {
        statusCode: 402,
        response: 'The user does not exist',
        error,
      }
    }
  }

  @put('/usuarios/{id}', {
    responses: {
      '204': {
        description: 'el usuario fue editado correctamente',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuario: Usuario,
  ): Promise<{}> {

    // const username = usuario.username;

    // const usernameExist = await this.usuarioRepository.findOne({
    //   where: { username },
    // });

    // const own = await this.usuarioRepository.findOne({
    //   where: {
    //     and: [
    //       { username },
    //       { id }
    //     ]
    //   },
    // });

    // if (!usernameExist) {
    //   await this.usuarioRepository.replaceById(id, usuario);
    //   return {
    //     statusCode: 200,
    //     response: 'The user was edit correctly',
    //   }
    // }

    // if (own) {
    //   await this.usuarioRepository.replaceById(id, usuario);
    //   return {
    //     statusCode: 200,
    //     response: 'The user was edit correctly',
    //   }
    // }

    const tx = await this.usuarioRepository.beginTransaction(IsolationLevel.READ_COMMITTED);

    try {
      await this.usuarioRepository.replaceById(id, usuario);
      await tx.commit();
      return {
        statusCode: 200,
        response: 'The user was edit correctly',
      }
    } catch (error) {
      await tx.rollback();
      return {
        statusCode: 400,
        response: 'The user is incorrect',
        error,
      }
    }
  }

  @del('/usuarios/{id}', {
    responses: {
      '204': {
        description: 'The user was remove correctly',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<{}> {

    const tx = await this.usuarioRepository.beginTransaction(IsolationLevel.READ_COMMITTED);

    const UserExist = await this.usuarioRepository.findOne({
      where: { id }
    })

    if (UserExist) {
      const tiempos = await this.tiempoRepository.find({
        where: { usuario_id: id },
      });

      const tiempoIds = tiempos.map(item => item.id);

      await this.tiempoRepository.deleteAll({
        id: {
          inq: tiempoIds,
        }
      },
        { transation: tx }
      );

      await this.usuarioRepository.deleteById(id, { transation: tx });

      return {
        statusCode: 200,
        response: 'The user was deleted'
      }
    }
    return {
      statusCode: 403,
      response: 'The user was not deleted because it does NOT exist',
    }
  }
}
