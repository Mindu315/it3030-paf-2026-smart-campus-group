export const RESOURCE_TYPES = [
  'LECTURE_HALL',
  'LAB',
  'MEETING_ROOM',
  'PROJECTOR',
  'CAMERA',
]

export const RESOURCE_STATUSES = [
  'AVAILABLE',
  'ACTIVE',
  'OUT_OF_SERVICE',
]

export const defaultResourceForm = {
  name: '',
  type: '',
  capacity: '',
  location: '',
  availabilityStart: '',
  availabilityEnd: '',
  status: '',
  description: '',
}
