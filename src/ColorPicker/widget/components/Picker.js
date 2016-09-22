var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ColorPicker/lib/react"], function (require, exports, React) {
    "use strict";
    var Picker = (function (_super) {
        __extends(Picker, _super);
        function Picker(props) {
            _super.call(this, props);
            logger.debug("Picker: constructor");
            this.onChange = this.onChange.bind(this);
            this.state = {
                color: this.props.color,
            };
        }
        Picker.prototype.render = function () {
            logger.debug("Picker: render");
            var color = this.state.color;
            var divStyle = {
                backgroundColor: color,
            };
            return (React.createElement("div", { className: "widgetname" },
                React.createElement("form", null,
                    React.createElement("div", { className: "input-group" },
                        React.createElement("input", { type: "text", className: "form-control", placeholder: "#rrggbb", value: color, onChange: this.onChange }),
                        React.createElement("div", { className: "input-group-addon" },
                            React.createElement("input", { type: "color", defaultValue: color, onChange: this.onChange })))),
                React.createElement("div", { className: "widgetname-infoTextNode", style: divStyle }, this.props.messageString)));
        };
        Picker.prototype.onChange = function (event) {
            logger.debug("Picker: onChange ");
            var value = event.target.value;
            this.props.onChange(value);
            this.setState({ color: value });
        };
        return Picker;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Picker;
});
