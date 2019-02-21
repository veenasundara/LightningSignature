({
    /**
     * once javascript libraries are loaded, call Jsigature methods to initialize the signature pad
     * Based on attributes, set up attributes of the signature pad (such as pen color)
     */
    scriptsLoaded: function (component, event, helper)
    {
        // find the div to load signature pad into
        //console.log('scripts loaded');
        // let $sigdiv = $("#signature");
        let divId = helper.hlpGetId(component);
        // console.log('divid = ' + divId);
        //let $sigdiv = $('#sig_signature');
        let $sigdiv = $(divId);
        // console.log('$sigdiv id = ' + $sigdiv.attr('id'));



        // set up settings for signature pad
        let settings = {};
        let color = component.get("v.pen-color");
        if(color)
        {
            settings.color = color;
        }
        let backgroundColor = component.get("v.background-color");
        if(backgroundColor)
        {
            settings["background-color"] = backgroundColor;
        }
        let signatureLineColor = component.get("v.signatureLine-color");
        if(signatureLineColor)
        {
            settings["decor-color"] = signatureLineColor;
        }
        let penWidth = component.get("v.pen-width");
        if(penWidth)
        {
            settings.lineWidth = penWidth;
        }
        let readOnly = component.get("v.readOnly");
        settings.readOnly = readOnly;
        if(readOnly)
        {
            component.set("v.showClearButton", false);
            component.set("v.showSaveButton", false);
        }
        let signatureLine = component.get("v.showSignatureLine"); // whether to show line below signature
        settings.signatureLine = signatureLine;


        // initialize signature widget
        $sigdiv.jSignature(settings);

        // bind change event of signature widget so that we can clear error messages when a stroke is made on the canvas
        // since bind function does not allow changing component attributes, we will fire an event and process that to clear error messages
        let cmp = component; // component is not visible in the bound function
        let name = component.get("v.name");
        $sigdiv.bind('change', function(e){
                                                let evt = cmp.getEvent("EvtCmpSignatureChanged");
                                                evt.setParams({"name": name});
                                                evt.fire();
                                            });


        // settings = $sigdiv.jSignature("getSettings");
        // console.log('settings = ' + JSON.stringify(settings));
    },


    /**
     * clear the signature widget
     */
    clear: function (component, event, helper)
    {
        helper.hlpClear(component);
    },


    /**
     * captures the signature in the widget in the format specified and returns. It will be an array of 2 strings
     * First string is the mime type and second is the actual image data.
     * If there is nothing on the widget, it displays an error
     */
    capture: function (component, event, helper)
    {
        helper.clearError(component);
        if(helper.hlpIsEmpty(component))
        {
            helper.showError(component, 'Please draw something first');
            return;
        }
        let format = event.getParam('arguments').format || 'image';
        return helper.hlpCapture(component, format);
    },

    /**
     * Creates an html image element from the drawing in the signature widget.
     * If there is nothing on the widget, it displays an error
     */
    createImage: function (component, event, helper)
    {
        helper.clearError(component);
        if(helper.hlpIsEmpty(component))
        {
            helper.showError(component, 'Please draw something first');
            return;
        }

        let format = event.getParam('arguments').format || 'image';
        switch(format)
        {
            case 'image':
                return helper.hlpCreateImagePNG(component);
                break;
            case 'svg':
                return helper.hlpCreateImageSvg(component);
                break;
            case 'svgbase64':
                return helper.hlpCreateImageSvgBase64(component);
                break;
        }
    },

    /**
     * Saves the drawing on the signature widget to a Salesforce file.  Uses the attributes "fileName" and "recordId"
     * if not filename is specified, "signature.png" will be the name of the file.
     * If a recordId is specified, the file will be attached to that recordId
     * If there is nothing on the widget, it displays an error
     */
    save: function (component, event, helper)
    {
        helper.clearError(component);
        if(helper.hlpIsEmpty(component))
        {
            helper.showError(component, 'Please draw something first');
            return;
        }

        let fileName = component.get("v.fileName") || 'signature';
        //console.log('fileName = ' + fileName);
        helper.hlpCreateFile(component, fileName + '.png', component.get("v.recordId"));
    },

    /**
     * Saves the drawing on the signature widget to a Salesforce file. This is called by the method createFile
     * The fileName and recordId are passed as arguments to the method
     * if not filename is specified, "signature.png" will be the name of the file.
     * If a recordId is specified, the file will be attached to that recordId
     * If there is nothing on the widget, it displays an error
     */
    createFile: function (component, event, helper)
    {
        helper.clearError(component);
        if(helper.hlpIsEmpty(component))
        {
            helper.showError(component, 'Please draw something first');
            return;
        }

        // console.log('in CmpSig createFile, args = ' + JSON.stringify(event.getParam('arguments')));
        let fileName = event.getParam('arguments').fileName || 'signature';
        // console.log('fileName = ' + fileName);
        helper.hlpCreateFile(component, fileName + '.png', event.getParam('arguments').recordId);
    },

    /**
     * returns true if there is nothing drawn on the signature widget
     */
    isEmpty: function (component, event, helper)
    {
        return helper.hlpIsEmpty(component);
    },

    /**
     * This is called when a stroke is made on the canvas. It clears error messages if any
     */
    change: function (component, event, helper)
    {
        let error = component.get("v.error");
        if(error)
        {
            helper.clearError(component);
        }
    },

    /**
     * This is called my the method "loadFile"
     * This method can have either fileName or contentDocumentId specified.
     * if contentDocumentId is specified, the contents of that file are loaded into the widget
     * if file name is specified, the latest version of ContentVersion that as the Title = fileName is loaded
     */
    loadFile: function (component, event, helper)
    {
        //console.log('in loadFile');
        helper.hlpClear(component);
        let contentDocumentId = event.getParam('arguments').contentDocumentId;
        if($A.util.isEmpty(contentDocumentId))
        {
            let fileName = event.getParam('arguments').fileName || 'signature.png';
            helper.hlpLoadFile(component, fileName);
        }
        else
        {
            helper.hlpLoadFile(component, contentDocumentId);
        }
    },

})