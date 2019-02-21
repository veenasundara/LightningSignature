({
    captureSvg: function (component)
    {
        console.log('in captureSvg');
        let img = component.find("sig").createImage("svg");
        $(img).appendTo($("#svgBase64output")); // append the image (SVG) to DOM.
    },

    captureSvgBase64: function (component)
    {
        let img = component.find("sig").createImage("svgbase64");
        $(img).appendTo($("#svgoutput")); // append the image (SVG) to DOM.
    },

    capturePNG: function (component)
    {
        let img = component.find("sig").createImage("image");
        $(img).appendTo($("#base30output")); // append the image (SVG) to DOM.
    },

    createFile: function (component, event, helper)
    {
        if(component.find("sig").isEmpty())
        {
            component.set("v.error", "Please draw your signature first");
            return;
        }

        component.set("v.showSpinner", true);
        let fileName = component.get("v.fileName");
        let recordId = component.get("v.recordId");

        if(fileName && recordId) component.find("sig").createFile(fileName, recordId);
        else if (fileName) component.find("sig").createFile(fileName);
        else component.find("sig").createFile();
    },

    fileCreated: function (component, event, helper)
    {
        // console.log('name = ' + event.getParam('name'));

        component.set("v.fileId", event.getParam('contentDocumentId'));
        component.set("v.createdFileName", event.getParam('fileName'));
        component.set("v.showSpinner", false);
    },

    clearFile: function (component, event, helper)
    {
        component.set("v.fileId", '');
    },

    loadFile: function (component, event, helper)
    {
       component.find("sig2").loadFile(component.get("v.retrieveFileName"));
    },
})