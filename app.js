const state = { currentView: 'inicio', locationSharing: true, sharingConsent: { laura: true, diego: true, sofia: true }, toastTimer: null };

const viewLabels = {
  inicio: 'Inicio',
  dispositivos: 'Dispositivos',
  ubicacion: 'Ubicación compartida',
  alertas: 'Alertas',
  limites: 'Límites de uso',
  privacidad: 'Privacidad y consentimiento',
  seguridad: 'Uso responsable'
};

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function showToast(message) {
  const toast = $('#toast');
  $('#toast-text').textContent = message;
  toast.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function navigate(view) {
  if (!viewLabels[view]) return;
  state.currentView = view;
  const isHome = view === 'inicio';
  $$('[data-page="inicio"]').forEach((el) => el.classList.toggle('is-visible', isHome));
  $$('.subpage').forEach((el) => el.classList.toggle('is-visible', el.dataset.page === view));
  $$('.nav-item, .mobile-nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  $('#breadcrumb-current').textContent = viewLabels[view];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal({ eyebrow = 'CONTROL TRANSPARENTE', title, copy, options = [], primary = 'Entendido', secondary = 'Ahora no', onPrimary }) {
  const backdrop = $('#modal-backdrop');
  $('#modal-eyebrow').textContent = eyebrow;
  $('#modal-title').textContent = title;
  $('#modal-copy').textContent = copy;
  $('#modal-primary').textContent = primary;
  $('#modal-secondary').textContent = secondary;
  $('#modal-options').innerHTML = options.map((option) => `<div class="modal-option"><span>${option.icon}</span><div><strong>${option.title}</strong><small>${option.copy}</small></div></div>`).join('');
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  const primaryButton = $('#modal-primary');
  primaryButton.onclick = () => {
    if (onPrimary) onPrimary();
    closeModal();
  };
}

function closeModal() {
  $('#modal-backdrop').hidden = true;
  document.body.style.overflow = '';
}

const icons = {
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg>',
  device: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M10 5h4M11 18.5h2"/></svg>'
};

function openPrivacy() {
  openModal({
    eyebrow: 'PRIVACIDAD Y CONSENTIMIENTO',
    title: 'Revisar permisos activos',
    copy: 'SafeHub te muestra qué se comparte, con quién y por cuánto tiempo. Puedes pausarlo sin avisos ocultos.',
    options: [
      { icon: icons.location, title: 'Ubicación compartida', copy: '3 personas · Activa hasta que cualquiera la pause.' },
      { icon: icons.bell, title: 'Alertas de llegada', copy: 'Diego · Colegio Monteverde · Notificación activa.' },
      { icon: icons.shield, title: 'Reglas de uso', copy: '6 reglas visibles para las personas afectadas.' }
    ],
    primary: 'Ir a privacidad',
    secondary: 'Cerrar',
    onPrimary: () => { navigate('privacidad'); showToast('Permisos listos para revisar'); }
  });
}

function openInvite() {
  openModal({
    eyebrow: 'INVITAR CON TRANSPARENCIA',
    title: 'Invitar a un familiar',
    copy: 'La persona recibirá una invitación para aceptar o rechazar cada permiso. No se activa nada automáticamente.',
    options: [
      { icon: icons.shield, title: 'Decisión compartida', copy: 'La persona invitada mantiene el control sobre sus datos.' },
      { icon: icons.location, title: 'Permisos por separado', copy: 'Ubicación, alertas y límites se aceptan de forma independiente.' }
    ],
    primary: 'Continuar invitación',
    secondary: 'Ahora no',
    onPrimary: () => showToast('Invitación preparada: falta añadir un contacto')
  });
}

function openAddDevice() {
  openModal({
    eyebrow: 'VINCULACIÓN CONSENTIDA',
    title: 'Añadir un dispositivo',
    copy: 'Generaremos un código de vinculación. La persona propietaria deberá aceptarlo desde su dispositivo.',
    options: [
      { icon: icons.device, title: 'Código de 6 caracteres', copy: 'Caduca en 10 minutos y solo sirve para esta familia.' },
      { icon: icons.shield, title: 'Permisos visibles', copy: 'Se revisan antes de terminar la vinculación.' }
    ],
    primary: 'Generar código',
    secondary: 'Cancelar',
    onPrimary: () => showToast('Código de vinculación generado · SH-4821')
  });
}

function openDevice(device = 'iphone') {
  const names = { iphone: 'iPhone 14 de Laura', pixel: 'Pixel 8 de Diego', ipad: 'iPad Air de Sofía' };
  openModal({
    eyebrow: 'DETALLE DEL DISPOSITIVO',
    title: names[device] || 'Dispositivo familiar',
    copy: 'Este resumen es visible para la persona vinculada y puede revisarse desde su propio dispositivo.',
    options: [
      { icon: icons.shield, title: 'Protección activa', copy: 'SafeHub está conectado y no hay alertas pendientes.' },
      { icon: icons.location, title: 'Ubicación compartida', copy: device === 'ipad' ? 'Pausada por la noche' : 'Activa con consentimiento.' },
      { icon: icons.bell, title: 'Gestionar permisos', copy: 'Revisar, pausar o revocar cualquiera de las funciones.' }
    ],
    primary: 'Gestionar permisos',
    secondary: 'Cerrar',
    onPrimary: () => { navigate('privacidad'); showToast('Permisos del dispositivo listos'); }
  });
}

function handleAction(action) {
  const actions = {
    privacy: openPrivacy,
    review: openPrivacy,
    invite: openInvite,
    'add-device': openAddDevice,
    location: () => navigate('ubicacion'),
    alerts: () => navigate('alertas'),
    'alert-settings': () => openModal({ eyebrow: 'ALERTAS A MEDIDA', title: 'Configurar una alerta', copy: 'Elige un evento relevante y acordad juntos quién debe recibir el aviso.', options: [{ icon: icons.location, title: 'Llegada o salida', copy: 'Avisar cuando alguien llegue a un lugar acordado.' }, { icon: icons.bell, title: 'Permiso actualizado', copy: 'Recibir un aviso cuando cambie un permiso importante.' }], primary: 'Crear alerta', secondary: 'Cancelar', onPrimary: () => showToast('Nueva alerta preparada') }),
    'new-rule': () => openModal({ eyebrow: 'HÁBITOS DIGITALES', title: 'Crear una regla juntos', copy: 'Las reglas son visibles para la persona afectada y se pueden revisar o pedir cambiar.', options: [{ icon: icons.device, title: 'Elegir dispositivo', copy: 'Selecciona uno de los dispositivos vinculados.' }, { icon: icons.shield, title: 'Definir horario', copy: 'Configura días, horas y una explicación clara.' }], primary: 'Continuar', secondary: 'Ahora no', onPrimary: () => showToast('Regla preparada para configurar') }),
    'edit-rule': () => showToast('La edición de reglas requiere confirmación de la persona afectada'),
    'download-data': () => showToast('Resumen de datos preparado para descargar'),
    'delete-data': () => openModal({ eyebrow: 'CONTROL DE DATOS', title: 'Solicitar eliminación', copy: 'Prepararemos una solicitud para eliminar los datos de tu familia. Esta acción puede revisarse antes de completarla.', options: [{ icon: icons.shield, title: 'Sin sorpresas', copy: 'Te mostraremos qué información se eliminará y qué dejará de funcionar.' }], primary: 'Preparar solicitud', secondary: 'Cancelar', onPrimary: () => showToast('Solicitud preparada para confirmar') }),
    'revoke-all': () => openModal({ eyebrow: 'REVOCACIÓN DE PERMISOS', title: 'Gestionar todos los permisos', copy: 'Cada persona conserva el derecho a pausar o revocar sus propios permisos. Elige qué revisar primero.', options: [{ icon: icons.location, title: 'Ubicación compartida', copy: 'Revisar personas, duración y precisión aproximada.' }, { icon: icons.bell, title: 'Alertas y actividad', copy: 'Revisar eventos y preferencias de avisos.' }], primary: 'Revisar permisos', secondary: 'Cerrar', onPrimary: () => showToast('Centro de permisos abierto') }),
    'read-policy': () => showToast('Compromiso de uso responsable abierto'),
    date: () => showToast('Mostrando la actividad de hoy')
  };
  if (actions[action]) actions[action]();
}

function setLocationToggle(toggle) {
  state.locationSharing = !state.locationSharing;
  toggle.classList.toggle('on', state.locationSharing);
  toggle.setAttribute('aria-label', state.locationSharing ? 'Pausar ubicación compartida' : 'Activar ubicación compartida');
  showToast(state.locationSharing ? 'Ubicación compartida activada con consentimiento' : 'Ubicación compartida pausada');
}

function setPersonToggle(toggle) {
  const person = toggle.dataset.person;
  const names = { laura: 'Laura', diego: 'Diego', sofia: 'Sofía' };
  state.sharingConsent[person] = !state.sharingConsent[person];
  const isOn = state.sharingConsent[person];
  toggle.classList.toggle('on', isOn);
  toggle.setAttribute('aria-label', `${isOn ? 'Pausar' : 'Activar'} ubicación de ${names[person]}`);
  showToast(`${names[person]}: ubicación compartida ${isOn ? 'activada' : 'pausada'}`);
}

$$('[data-view]').forEach((item) => item.addEventListener('click', () => navigate(item.dataset.view)));
$$('[data-action]').forEach((item) => item.addEventListener('click', () => handleAction(item.dataset.action)));
$$('[data-device]').forEach((item) => item.addEventListener('click', (event) => { event.stopPropagation(); openDevice(item.dataset.device); }));
$('#location-toggle').addEventListener('click', (event) => { event.stopPropagation(); setLocationToggle(event.currentTarget); });
$$('.sharing-person .toggle').forEach((toggle) => toggle.addEventListener('click', () => setPersonToggle(toggle)));
$('#modal-close').addEventListener('click', closeModal);
$('#modal-secondary').addEventListener('click', closeModal);
$('#modal-backdrop').addEventListener('click', (event) => { if (event.target.id === 'modal-backdrop') closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !$('#modal-backdrop').hidden) closeModal(); });

navigate('inicio');
