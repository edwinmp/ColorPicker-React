// declare globals
declare var logger: mendix.logger;

import * as React from "ColorPicker/lib/react";
// Component state
export interface IPickerState {
    color: string;
}
// Component PropTypes
export interface IPickerProps extends React.Props<Picker> {
    color: string;
    readOnly: boolean;
    messageString: string;
    onClick: Function;
    onChange: Function;
}

export default class Picker extends React.Component<IPickerProps, IPickerState> {
    constructor(props) {
        super(props);
        logger.debug("Picker: constructor");
        // bind context
        this.onChange = this.onChange.bind(this);
        // Set default state
        this.state = {
            color: this.props.color,
        };
    }
    public render() {
        logger.debug("Picker: render");
        let color = this.state.color;
        const divStyle = {
                backgroundColor: color,
            };
        return (
            <div className="widgetname">
                <form>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="#rrggbb"
                            value={color}
                            onChange={this.onChange}
                            // ref={(c) => this.colorInputNode = c}
                        />
                        <div className="input-group-addon">
                            <input type="color" defaultValue={color} onChange={this.onChange} />
                        </div>
                    </div>
                </form>
                <div className="widgetname-infoTextNode" style={divStyle}>{this.props.messageString}</div>
            </div>
        );
     }
     private onChange(event) {
         logger.debug("Picker: onChange ");
         let value: string = event.target.value;
         this.props.onChange(value);
         this.setState({ color: value });
     }
}
