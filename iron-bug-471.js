if (Meteor.isClient) {
  alert('App has been (re)loaded.');

  Router.configure({
    notFoundTemplate: 'overview',
    loadingTemplate: 'loading'
  });
  Router.onBeforeAction('loading');
  Router.map(function () {

   this.route('hello', {
     path: '/',
     template: 'hello',
   });

   this.route('otherpage', {
     path: '/otherpage',
     template: 'otherpage',
   });

   this.route('invoicePDF', {
     where: 'server',
     path: '/billing/invoices/:_id/:friendlynumber.pdf',
     action: function () {
      this.stop(); // with or without that - no difference
     }
    });
  });
}

if (Meteor.isServer) {
  Router.map(function () {
    this.route('invoicePDF', {
        where: 'server',
        path: '/billing/invoices/:_id/:number.pdf',

        action: function () {
            try {
                check(this.params._id, String);
                check(this.params.number, String);
            } catch(e) {
                this.response.writeHead(400);
                this.response.end('Bad request.');
                return;
            }

            this.response.writeHead(200, {'Content-Type': 'application/pdf',
                'Content-disposition': 'attachment; filename=faktura_' + this.params.number + '.pdf'});
            this.response.end('nothing');
        }
    });
  });
}
