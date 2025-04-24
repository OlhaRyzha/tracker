export const messageOnSuccessCreated = (value: string) =>
  `A new ${value} has been successfully created`;

export const messageOnSuccessEdited = (value: string) =>
  `${value.toLowerCase()} has been successfully edited`;

export const messageOnSuccessDeleted = (value: string) =>
  `${value.toLowerCase()} has been successfully deleted`;

export const validationMessages = {
  required: 'This field is required',
  url: 'Invalid URL',
  fileExtension: 'Invalid file extension',
  emty: 'This field cannot be empty',
  unsupportedFormat: 'Unsupported audio format',
  selectAtLeastOne: 'Select at least one genre',
  lengthMax: (maxSize: string) => `File must be smaller than ${maxSize}`,
};
