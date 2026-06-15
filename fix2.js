const fs = require('fs');
const files = ['api.pug', 'booking.pug', 'business.pug', 'general.pug', 'notifications.pug', 'payments.pug'];
files.forEach(f => {
  const p = 'src/views/settings/' + f;
  let c = fs.readFileSync(p, 'utf8');
  // the menu is inside .col-md-3 as .list-group.mb-4
  c = c.replace(/\.list-group\.mb-4[\s\S]*?(?=\s+\.col-md-9)/, 'include _menu\n    ');
  fs.writeFileSync(p, c);
});
console.log('Replaced menus with include');
