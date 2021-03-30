const getFrontendMenu = (role = 'USER_ROLE') => {

    const menu = [
        {
          title: 'Main',
          icon: 'mdi mdi-gauge',
          submenu: [
            { title: 'Dashboard', url: '/dashboard'},
            { title: 'ProgressBar', url: '/progress'},
            { title: 'Graficas', url: '/grafica1'},
            { title: 'Promises', url: '/promises'},
            { title: 'Rxjs', url: '/rxjs'}
          ]
        },
    
        {
          title: 'Maintenance',
          icon: 'mdi mdi-folder-lock-open',
          submenu: [
            // { },
            { title: 'Hospitals', url: 'hospitals'},
            { title: 'Doctors', url: 'doctors'},
            
          ]
        }
      ];

      if(role === 'ADMIN_ROLE'){
          menu[1].submenu.unshift({title: 'Users', url: 'users'})
      }
      return menu;

}

module.exports = {
    getFrontendMenu
}
