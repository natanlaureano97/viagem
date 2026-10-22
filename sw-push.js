/* Avisos de parada (Firebase): mostra a notificação mesmo com o app fechado e abre o app ao tocar. */
self.addEventListener('push', (evento) => {
  let p = {};
  try { p = evento.data ? evento.data.json() : {}; } catch (_) { p = { notification: { body: evento.data ? evento.data.text() : '' } }; }
  const n = p.notification || (p.data && p.data.notification) || {};
  const d = p.data || {};
  const link = (p.fcmOptions && p.fcmOptions.link) || n.click_action || d.link || self.registration.scope;
  const titulo = n.title || d.titulo || 'TRIP ARGENTINA';
  evento.waitUntil(self.registration.showNotification(titulo, {
    body: n.body || d.corpo || '',
    icon: n.icon || 'icone-192.png',
    badge: n.badge || 'icone-192.png',
    tag: n.tag || 'parada',
    renotify: true,
    data: { link },
  }));
});

self.addEventListener('notificationclick', (evento) => {
  evento.notification.close();
  const link = (evento.notification.data && evento.notification.data.link) || self.registration.scope;
  evento.waitUntil((async () => {
    const abertas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of abertas) {
      if (c.url.startsWith(self.registration.scope)) { await c.focus(); try { await c.navigate(link); } catch (_) { /* iOS */ } return; }
    }
    await self.clients.openWindow(link);
  })());
});
