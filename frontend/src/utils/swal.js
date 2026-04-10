import Swal from 'sweetalert2'

export function confirmApproval({ title = 'Approve booking?', html = '', confirmText = 'Approve', cancelText = 'Cancel' } = {}) {
  return Swal.fire({
    title,
    html,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    focusCancel: true,
    background: '#fff',
    color: '#000',
    customClass: { popup: 'shadow-2xl' }
  }).then((r) => r.isConfirmed)
}

export function showError(message, title = 'Oops') {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    background: '#fff',
    color: '#000',
    confirmButtonColor: '#b91c1c'
  })
}

export function showSuccess(message, title = 'Success') {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    background: '#fff',
    color: '#000',
    confirmButtonColor: '#16a34a'
  })
}

export default { confirmApproval, showError, showSuccess }
