var $ = Dom7;

var device = Framework7.getDevice();
var app = new Framework7({
  name: 'Gaspass', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element

  id: 'pl.gasp.ass', // App bundle ID
  // App store
  store: store,
  // App routes
  routes: routes,

dialog: {
  usernamePlaceholder: "NewPass",
  passwordPlaceholder: "RecentPass",
},
  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova && !device.electron,
    scrollIntoViewCentered: device.cordova && !device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      f7.loginScreen.open('#my-login-screen');
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
      if (localStorage.passwd && localStorage.passwd.length > 0){
        $(".first").text("Stay aware of your surrounding")
      }
    },
    pageInit: (page) => {
      
      if (page.route.url == '/data-base/') {
        let vault = JSON.parse(localStorage.vault)
        $(".data").find("tbody").empty()
        vault.forEach(element => {
          $(".data").find("tbody").append($$(`
          <tr>
						<td class="label-cell">${element.platform}</td>
						<td class="numeric-cell">${element.login}</td>
						<td class="numeric-cell">${element.password}</td>
					</tr>
          `))
        });
      }
    }
  },
});
// Login Screen Demo
$('#my-login-screen .login-button').on('click', function () {
  var password = $('#my-login-screen [name="password"]').val();
  if(localStorage.passwd == password){
    app.loginScreen.close('#my-login-screen')
    localStorage.registered = 1
    $(".unauth").removeClass('unauth')
  }else{
    if(localStorage.registered == 1){ 
      app.dialog.alert("Wrong password.")
    }else{
      localStorage.passwd = password
      app.loginScreen.close('#my-login-screen')
      localStorage.registered = 1
      $(".unauth").removeClass('unauth')
    }
  }
});
function generate(len = 15){
  let charset = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()"
  let result = ""
  for(let i = 0; i<len;i++ ){
    let charsetlength = charset.length
    result+=charset.charAt(Math.floor(Math.random() * charsetlength))
  }
  return result;
}
$(document).on("click", ".generate", function(){
  let passwd = generate()
  $(".newP").text(passwd)

  if (app.device.cordova) {
    cordova.plugins.clipboard.copy(passwd);
  } else {
    navigator.clipboard.writeText(passwd)
  }

  app.toast.create({
    text: 'Copied to clipboard',
    closeTimeout: 2000,
  }).open()
})

$(document).on("click", ".rec-done", function(){
  let addplat = $(".addPlat").val()
  let addpass = $(".addPass").val()
  let addlog = $(".addLog").val()
  if(typeof localStorage.vault == "undefined" || localStorage.vault == "{}"){
    let vault = []
    let insert = {}
    insert.platform = addplat
    insert.password = addpass
    insert.login = addlog
    vault.push(insert)
    localStorage.vault = JSON.stringify(vault)
  }else{
    let vault = JSON.parse(localStorage.vault)
    let insert = {}
    insert.platform = addplat
    insert.password = addpass
    insert.login = addlog
    vault.push(insert)
    localStorage.vault = JSON.stringify(vault)
  }
  app.dialog.alert("Credientals saved successfully.")
})

$(".logout").on("click", function(){
  $('#my-login-screen [name="password"]').val('')
  app.loginScreen.open('#my-login-screen');
})



