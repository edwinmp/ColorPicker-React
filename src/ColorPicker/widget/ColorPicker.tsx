/*
    ColorPicker
    ========================

    @file      : ColorPicker.js
    @version   : 1.0.0
    @author    : Edwin P. Magezi
    @date      : 9/14/2016
    @copyright : Flock of Birds
    @license   : MIT

    Documentation
    ========================
    Describe your widget here.
*/

// declare globals
declare var mx: mx.mx;
declare var logger: mendix.logger;

// import dependent modules
import * as dojoDeclare from "dojo/_base/declare";
import * as dojoLang from "dojo/_base/lang";
import * as mxLang from "mendix/lang";
import * as validator from "mendix/validator";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";

import * as React from "ColorPicker/lib/react";
import ReactDOM = require("ColorPicker/lib/react-dom");

// import components
import Picker from "./components/Picker";

class ColorPicker extends _WidgetBase {
    // Parameters configured in the Modeler
    private backgroundColor: string;
    private messageString: string;
    private onChangeMicroflow: string;

    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObj: mendix.lib.MxObject;
    private handles: any[];
    private _readOnly: boolean;

    // The TypeScript Contructor, not the dojo consctuctor, move contructor work into widget prototype at bottom of the page. 
    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoColorPicker(args, elem);
    }
    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    public postCreate() {
        logger.debug(this.id + ".postCreate");

        if (this.readOnly || this.get("disabled")) {
            this._readOnly = true;
        }
        // hitch context to all callbacks
        this.onclickEvent = dojoLang.hitch(this, this.onclickEvent);
        this.onChangeEvent = dojoLang.hitch(this, this.onChangeEvent);
        this.callMicroflow = dojoLang.hitch(this, this.callMicroflow);

        this._updateRendering();
    }
    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    public update(obj: mendix.lib.MxObject, callback?: Function) {
        logger.debug(this.id + ".update");
        this.contextObj = obj;

        this._updateRendering(callback);
        this._resetSubscriptions();
    }
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    public uninitialize() {
        logger.debug(this.id + ".uninitialize");
        // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.  
    }
    // Set color value, could trigger a rerender the interface.
    private _updateRendering (callback?: Function) {
        logger.debug(this.id + ".updateRendering");
        if (this.contextObj !== null && typeof(this.contextObj) !== "undefined") {
            const colorValue = String(this.contextObj.get(this.backgroundColor));
            ReactDOM.render(
                <Picker
                    color={colorValue}
                    messageString={this.messageString}
                    onClick={this.onclickEvent}
                    onChange={this.onChangeEvent}
                    readOnly={this._readOnly}
                    />, this.domNode
            );
        }
        // The callback, coming from update, needs to be executed, to let the page know it finished rendering
        mxLang.nullExec(callback);
    }
    // onclick Event is called when the button is clicked, doing asyc sequesnce:
    // confirmation, validation, saving, show progress, call microlow
    private onclickEvent() {
        logger.debug(this.id + ".onclickEvent");
    }
    private onChangeEvent(value: string) {
        logger.debug(this.id + ".onChangeEvent");
        if (validator.validate(value, "String") === validator.validation.OK) {
            this.contextObj.set(this.backgroundColor, value);
            if (typeof (this.onChangeMicroflow) !== "undefined" && this.onChangeMicroflow.trim() !== "") {
                this.callMicroflow();
            }
        }
    }
    // call the microflow and remove progress on finishing
    private callMicroflow(callback?: Function) {
        logger.debug(this.id + ".callMicroflow");
        mx.data.action({
            callback: (obj) => {
                logger.debug(this.id + ": Microflow executed successfully");
            },
            error: dojoLang.hitch(this, (error) => {
                logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
            }),
            params: {
                actionname: this.onChangeMicroflow,
                applyto: "selection",
                guids: [ this.contextObj.getGuid() ],
            },
            store: {
                caller: this.mxform,
            },
        });
    }
    // Remove subscriptions
    private _unsubscribe () {
        if (this.handles) {
            for (let handle of this.handles) {
                mx.data.unsubscribe(handle);
            }
            this.handles = [];
        }
    }
    // Reset subscriptions.
    private _resetSubscriptions () {
        logger.debug(this.id + "._resetSubscriptions");
        // Release handles on previous object, if any.
        this._unsubscribe();
        // When a mendix object exists create subscribtions.
        if (this.contextObj) {
            let objectHandle = mx.data.subscribe({
                callback: dojoLang.hitch(this, function (guid) {
                    this._updateRendering();
                }),
                guid: this.contextObj.getGuid(),
            });

            let attrHandle = mx.data.subscribe({
                attr: this.backgroundColor,
                callback: dojoLang.hitch(this, function (guid, attr, attrValue) {
                    this._updateRendering();
                }),
                guid: this.contextObj.getGuid(),
            });

            this.handles = [ objectHandle, attrHandle ];
        }
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
let dojoColorPicker = dojoDeclare("ColorPicker.widget.ColorPicker", [_WidgetBase], (function(Source: any) {
    let result: any = {};
    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    result.constructor = function() {
        logger.debug( this.id + ".constructor");
        this.progressInterval = 100;
    };
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (ColorPicker)));

export = ColorPicker;

