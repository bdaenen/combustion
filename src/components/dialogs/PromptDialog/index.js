import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import autobind from 'autobind-decorator';

import Input from 'react-toolbox/lib/input';

import Dialog from '../Dialog'

import styles from './styles/index.css';
import DownloadLocationSelect from "../../DownloadLocationSelect";


@CSSModules(styles)
class PromptDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.toggle !== this.props.toggle) {
            this.setState({value: nextProps.placeholder});
        }
    }

    @autobind onChange(value) {
        this.setState({value});
    }

    @autobind onSubmit() {
        this.props.onSubmit(this.state.value);
        this.onHide();
    }

    @autobind onDismiss(event) {
        event.preventDefault();
        this.setState({
            suffix: '',
            baseDir: '/downloads/transmission'
        })
        this.onHide();
    }

    @autobind onHide() {
        this.setState({
            suffix: '',
            baseDir: '/downloads/transmission'
        })
        this.props.onToggle();
    }

    render() {
        return (
            <Dialog
                show={this.props.toggle}
                onHide={this.onHide}
                header={this.props.header}
                actions={[
                    {label: 'Cancel', onClick: this.onHide},
                    {label: this.props.action || 'Ok', onClick: this.onSubmit, primary: true}
                ]}
            >
                <div styleName='body'>
                    <div styleName='content'>
                        {this.props.question === 'Location'
                            ? (
                                <DownloadLocationSelect onChange={this.onChange} value={this.state.value}/>
                            )
                            : (
                                <Input type='text' label={this.props.question && this.props.question}
                                       onChange={this.onChange} value={this.state.value}/>
                            )
                        }
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default PromptDialog;
