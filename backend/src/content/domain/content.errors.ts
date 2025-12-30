export class InvalidContentTitleError extends Error {
  constructor() {
    super('Content title is invalid');
    this.name = 'InvalidContentTitleError';
  }
}

export class InvalidContentLocationError extends Error {
  constructor() {
    super('Content location is invalid');
    this.name = 'InvalidContentLocationError';
  }
}

export class ContentNotFoundError extends Error {
  constructor(id: string) {
    super(`Content with id ${id} not found`);
    this.name = 'ContentNotFoundError';
  }
}
