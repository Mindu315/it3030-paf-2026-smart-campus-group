export function validateResourceForm(formData = {}) {
  const errors = {}

  const name = formData.name?.toString().trim()
  const type = formData.type?.toString().trim()
  const capacityValue = formData.capacity
  const location = formData.location?.toString().trim()
  const availabilityStart = formData.availabilityStart?.toString().trim()
  const availabilityEnd = formData.availabilityEnd?.toString().trim()
  const status = formData.status?.toString().trim()

  if (!name) errors.name = 'Name is required'
  if (!type) errors.type = 'Type is required'

  if (capacityValue === '' || capacityValue === null || capacityValue === undefined) {
    errors.capacity = 'Capacity is required'
  } else if (Number(capacityValue) < 1) {
    errors.capacity = 'Capacity must be at least 1'
  }

  if (!location) errors.location = 'Location is required'
  if (!availabilityStart) errors.availabilityStart = 'Availability start is required'
  if (!availabilityEnd) errors.availabilityEnd = 'Availability end is required'
  if (!status) errors.status = 'Status is required'

  if (availabilityStart && availabilityEnd && availabilityEnd <= availabilityStart) {
    errors.availabilityEnd = 'Availability end must be later than availability start'
  }

  return errors
}
