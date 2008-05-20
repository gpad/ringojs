// import request handler from simpleweb module
importFromModule('helma.simpleweb', 'handleRequest');
// import render
importFromModule('helma.skin', 'render');
// mount web app module on /mount/point/
importModule('webmodule', 'mount.point');
// continuation support
importModule('helma.continuation');

importModule('helma.logging', 'logging');
logging.enableResponseLog();
var log = logging.getLogger(__name__);

// import macrofilters
importModule('helma.filters', 'filters');

// the main action is invoked for http://localhost:8080/
function main_action() {
    render('skins/index.html', { title: 'Welcome to Helma NG' });
}

// demo for skins, macros, filters
function skins_action() {
    var context = {
        title: 'Skin Demo',
        name: 'Luisa',
        names: ['Benni', 'Emma', 'Luca', 'Selma']
    };
    render('skins/skins.html', context);
}

// demo for log4j logging
function logging_action() {
    // make sure responselog is enabled
    var hasResponseLog = logging.responseLogEnabled();
    if (!hasResponseLog) {
        logging.enableResponseLog();
        log.debug("enabling response log");
    }
    log.info("Hello world!");
    if (req.data.makeTrouble) {
        try {
            foo.bar.moo;
        } catch (e) {
            log.error(e, e.rhinoException);
        }
    }
    render('skins/logging.html', { title: "Logging Demo" });
    if (!hasResponseLog) {
        log.debug("disabling response log");
        logging.disableResponseLog();
    }
    logging.flushResponseLog();
}

// demo for continuation support
function continuation_action() {
    if (req.params.helma_continuation == null) {
        // set query param so helma knows to switch rhino optimization level to -1
        res.redirect(req.path + "?helma_continuation=");
    }
    // render first page
    render('skins/continuation.html', {
        title: "Continuations Demo",
        skin: "step1",
        href: Continuation.nextUrl()
    });
    Continuation.nextPage();
    // render second page
    var message = req.data.message;
    render('skins/continuation.html',  {
        title: "Continuations (Page 2 of 3)",
        skin: "step2",
        href: Continuation.nextUrl()
    });
    Continuation.nextPage();
    // render third page
    render('skins/continuation.html', {
        title: "Continuations (last Page)",
        skin: "step3",
        message: message
    });
}
