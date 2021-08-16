import { InterfaceType, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@InterfaceType({
  description: 'Node',
})
export abstract class Node {
  @Field(() => ID)
  id: string;
}

@InterfaceType()
export abstract class Edge {
  cursor?: string;
}

@ObjectType()
export class PageInfo {
  startCursor?: string;

  endCursor?: string;

  hasPrevPage: boolean;

  hasNextPage: boolean;
}

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  @Field(() => Int)
  totalPages: number;
  /**
   * the current page this paginator "points" to
   */
  @Field(() => Int)
  currentPage: number;

  next?: string;
  previous?: string;
}

@ObjectType()
export class PaginationLinks {
  /**
   * a link to the "first" page
   */
  @Field(() => String, { nullable: true })
  first?: string;
  /**
   * a link to the "previous" page
   */
  @Field(() => String, { nullable: true })
  previous?: string;
  /**
   * a link to the "next" page
   */
  @Field(() => String, { nullable: true })
  next?: string;
  /**
   * a link to the "last" page
   */
  @Field(() => String, { nullable: true })
  last?: string;
}

@InterfaceType()
export abstract class Connection {
  meta: PaginationMeta;
  links: PaginationLinks;
}

@InterfaceType()
export abstract class CursorConnection {
  @Field(() => Int)
  totalCount: number;

  pageInfo: PageInfo;
}

export function PaginationBase<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class ConnectioneTypeType {
    @Field((type) => PaginationMeta)
    meta: PaginationMeta;
    @Field((type) => PaginationLinks)
    links: PaginationLinks;

    @Field((type) => [classRef])
    items: T[];
  }

  return ConnectioneTypeType;
}

export function PaginationCursor<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field((type) => String)
    cursor: string;

    @Field((type) => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field((type) => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field((type) => Int)
    totalCount: number;

    @Field((type) => PageInfo)
    pageInfo: PageInfo;
  }
  return PaginatedType;
}
