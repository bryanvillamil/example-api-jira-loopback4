import { repository, CountSchema, Count, Where, Filter } from "@loopback/repository";
import { IssueRepository } from "../repositories";
import { get, param, getWhereSchemaFor, getModelSchemaRef, getFilterSchemaFor } from "@loopback/rest";
import { Issue } from "../models/issue.model";

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


export class IssueController {
  constructor(
    @repository(IssueRepository)
    public issueRepository : IssueRepository,
  ) {}

  @get('/issue/count', {
    responses: {
      '200': {
        description: 'Issue model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Issue)) where?: Where<Issue>,
  ): Promise<Count> {
    return this.issueRepository.count(where);
  }

  @get('/issues', {
    responses: {
      '200': {
        description: 'Array of Issue model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Issue, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Issue)) filter?: Filter<Issue>,
  ): Promise<Issue[]> {
    return this.issueRepository.find(filter);
  }
}
