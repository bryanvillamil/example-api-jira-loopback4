/* eslint-disable @typescript-eslint/camelcase */
import { repository, Filter } from "@loopback/repository";
import { IssueRepository, ProyectoRepository, TiempoRepository } from "../repositories";
import { get, param, getModelSchemaRef, getFilterSchemaFor, post, requestBody, put, del } from "@loopback/rest";
import { Issue } from '../models/';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


export class IssueController {
  constructor(
    @repository(IssueRepository) protected issueRepository: IssueRepository,
    @repository(ProyectoRepository)
    public proyectoRepository: ProyectoRepository,
    @repository(TiempoRepository)
    public tiempoRepository: TiempoRepository,
  ) { }

  @get('/issues', {
    responses: {
      '200': {
        description: 'Array of Issue model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Issue, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Issue)) filter?: Filter<Issue>,
  ): Promise<{}> {
    // return this.issueRepository.find(filter);

    const issues = await this.issueRepository.find({
      include: [{ relation: 'proyecto' }]
    });

    return {
      statusCode: 200,
      response: issues,
    }
  }

  @get('/issues/{id}', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Issue, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Issue)) filter?: Filter<Issue>
  ): Promise<{}> {

    const issueExist = await this.issueRepository.findOne({
      where: { id },
    });

    if (issueExist) {
      const issue = await this.issueRepository.findById(id, filter);
      return {
        statusCode: 200,
        response: issue,
      }
    }
    return {
      statusCode: 403,
      response: 'The issue does not exist',
    }
  }

  @post('/issues', {
    responses: {
      '200': {
        description: 'Issue model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Issue) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Issue, {
            title: 'NewIssue',
            exclude: ['id'],
          }),
        },
      },
    })
    issue: Omit<Issue, 'id'>,
  ): Promise<{}> {

    const proyectoExist = await this.proyectoRepository.findOne({
      where: { id: issue.proyecto_id },
    });

    if (proyectoExist) {
      await this.issueRepository.create(issue);
      return {
        statusCode: 200,
        response: 'The issue was created correctly',
      }
    }
    return {
      statusCode: 403,
      response: 'The issue not was created correctly',
    }
  }

  @put('/issues/{id}', {
    responses: {
      '204': {
        description: 'el issue fue editado correctamente',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() issue: Issue,
  ): Promise<{}> {

    const issueExist = await this.issueRepository.findOne({
      where: { id },
    });

    const proyectoExist = await this.proyectoRepository.findOne({
      where: { id: issue.proyecto_id },
    });

    if (issueExist) {
      if (proyectoExist) {
        await this.issueRepository.replaceById(id, issue);
        return {
          statusCode: 200,
          response: 'The issue was created correctly',
        }
      }
      return {
        statusCode: 403,
        response: 'the issue is incorrect',
      }
    }

    return {
      statusCode: 403,
      response: 'the issue is incorrect',
    }
  }

  @del('/issues/{id}', {
    responses: {
      '204': {
        description: 'The issue was deleted correctly',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<{}> {

    const issueExist = await this.issueRepository.findOne({
      where: { id }
    })

    if (issueExist) {
      const tiempos = await this.tiempoRepository.find({
        where: { issue_id: id },
      });

      const tiempoIds = tiempos.map(item => item.id);

      await this.tiempoRepository.deleteAll({
        id: {
          inq: tiempoIds,
        }
      });

      await this.issueRepository.deleteById(id);

      return {
        statusCode: 200,
        response: 'The issue was deleted'
      }
    }
    return {
      statusCode: 403,
      response: 'The issue was not deleted because it does NOT exist',
    }
  }
}
