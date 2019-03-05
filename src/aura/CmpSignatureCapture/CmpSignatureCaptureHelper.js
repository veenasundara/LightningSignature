({
    /**
     * Creates an html image element by capturing the data from the widget in the svg format
     * @returns {HTMLImageElement}
     */
    hlpCreateImageSvg: function (component)
    {
        let datapair = this.hlpCapture(component, "svg");
        component.set("v.data", JSON.stringify(datapair));
        let i = new Image();
        i.src = 'data:' + datapair[0] + ';base64,' + btoa( datapair[1] );
        return i;
    },

    /**
     * Creates an html image element by capturing the data from the widget in the svg base64 format
     * @returns {HTMLImageElement}
     */
    hlpCreateImageSvgBase64: function (component)
    {
        let datapair = this.hlpCapture(component, "svgbase64");
        component.set("v.data", JSON.stringify(datapair));
        let i = new Image();
        i.src = "data:" + datapair[0] + "," + datapair[1];
        return i;
    },

    /**
     * Creates an html image element by capturing the data from the widget in the png base64 format
     * @returns {HTMLImageElement}
     */
    hlpCreateImagePNG: function (component)
    {
        let datapair = this.hlpCapture(component, "image");
        component.set("v.data", JSON.stringify(datapair));
        let i = new Image();
        i.src = "data:" + datapair[0] + "," + datapair[1];
        return i;
    },

    /**
     * captures the widget drawing in the format specified
     * @param format - can be svg, svgbase64 or image
     * @returns {*} - 2 element array. 1st is mime time and second is the image data
     */
    hlpCapture: function (component, format)
    {
        // console.log('format = ' + format);
        // let $sigdiv = $("#signature");
        let $sigdiv = $(this.hlpGetId(component));
        // console.log('$sigdiv id = ' + $sigdiv.attr('id'));
        return $sigdiv.jSignature("getData",format);
    },

    /**
     * populates the signature widget with the provided data
     * @param data - 2 element array. 1st is mime time and second is the image data
     */
    hlpPopulateData: function (component, data)
    {
        let $sigdiv = $(this.hlpGetId(component));
        $sigdiv.jSignature("setData", "data:" + data.join(","));
    },

    /**
     * Saves the drawing in the widget as a Salesforce file with the name specified in "fileName"
     * If "recordId" is specified, the file will be linked to it
     * @param fileName
     * @param recordId
     */
    hlpCreateFile: function (component, fileName, recordId)
    {
        this.showSpinner(component);
        let dataPair = this.hlpCapture(component, 'image');

        try
        {
            var action = component.get("c.ctrlCreateFile");
            action.setParams({ "fileName" : fileName,
                                "base64Data" : dataPair[1],
                                "recordId" : recordId});

            action.setCallback(this, function(response){
                if(!this.handleResponse(component, response))
                {
                    return;
                }
                var resp = response.getReturnValue();

                var evt = component.getEvent("EvtCmpSignatureFileCreated");
                evt.setParams({ "name" : component.get("v.name"),
                                "contentDocumentId": resp,
                                "fileName" : fileName});
                evt.fire();
                this.hideSpinner(component);
                // console.log('resp = ' + JSON.stringify(resp));
            });
            $A.enqueueAction(action);
        }
        catch(e)
        {
            this.showError(component, e.message);
        }

    },

    /**
     * Loads the image from a Salesforce file (must be png file created by this component) into the widget
     * The fileName can either be a name or ContentDocument.Id
     * if contentDocumentId is specified, the contents of that file are loaded into the widget
     * if file name is specified, the latest version of ContentVersion that as the Title = fileName is loaded
     */
    hlpLoadFile: function (component, fileName)
    {
        this.showSpinner(component);
        try
        {
            var action = component.get("c.ctrlGetFile");
            action.setParams({ "fileName" : fileName});

            action.setCallback(this, function(response){
                if(!this.handleResponse(component, response))
                {
                    return;
                }
                var resp = response.getReturnValue();
                //console.log('hlpLoadFile resp = ' + resp);
                if($A.util.isEmpty(resp))
                {
                    //console.log('in error');
                    this.showError(component, 'Could not find the file ' + fileName);
                    this.hideSpinner(component);
                    return;
                }

                this.hlpPopulateData(component, resp);

                this.hideSpinner(component);
                // console.log('resp = ' + JSON.stringify(resp));
            });
            $A.enqueueAction(action);
        }
        catch(e)
        {
            this.showError(component, e.message);
        }

    },

    /**
     * clear the widget
     */
    hlpClear : function(component) {

        this.clearError(component);
        // let $sigdiv = $("#signature");
        let $sigdiv = $(this.hlpGetId(component));
        $sigdiv.jSignature("reset"); // clears the canvas and rerenders the decor on it.

        let evt = component.getEvent("EvtCmpSignatureCleared");
        evt.setParams({"name": component.get("v.name")});
        evt.fire();

    },

    /**
     * Handle errors from apex methods
     */
    handleResponse : function(component, response) {
        try
        {
            var state = response.getState();
            if (state !== "SUCCESS")
            {
                var unknownError = true;
                if(state === 'ERROR')
                {
                    var errors = response.getError();
                    if (errors)
                    {
                        if (errors[0] && errors[0].message)
                        {
                            unknownError = false;
                            this.showError(component, errors[0].message);
                        }
                    }
                }
                if(unknownError)
                {
                    this.showError(component, 'Unknown error from Apex class');
                }
                return false;
            }
            return true;
        }
        catch(e)
        {
            this.showError(component, e.message);
            return false;
        }
    },

    /**
     * returns true if there is nothing drawn on the widget
     */
    hlpIsEmpty : function(component, format)
    {
        let $sigdiv = $(this.hlpGetId(component));
        format = format || 'native';
        //return $sigdiv.jSignature('getData', 'native').length == 0;
        return $sigdiv.jSignature('getData', format).length == 0;
    },

    /**
     * Gets the id of the div element that contains the signature widget
     */
    hlpGetId : function (component)
    {
        let sigId = '#' + component.get("v.name") + '_signature';
        return sigId;
    },

    /**
     * Displays an error message in red below the signature widget
     */
    showError : function(component, message)
    {
        component.set("v.error", message);
    },

    /**
     * clears the error message
     */
    clearError : function(component)
    {
        component.set("v.error", '');
    },

    showSpinner : function(component)
    {
        component.set("v.showSpinner", true);
    },

    hideSpinner : function(component)
    {
        component.set("v.showSpinner", false);
    },
})