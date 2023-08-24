import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import autobind from 'autobind-decorator';

import Input from 'react-toolbox/lib/input';

import Dialog from '../Dialog'

import styles from './styles/index.css';

const predefinedFolders = {
    "/downloads/plex/anime": '/plex/anime/',
    "/downloads/plex/movies": '/plex/movies/',
    "/downloads/plex/series": '/plex/series/',
    "/downloads": '/',
    "/downloads/Benno": '/Benno/',
    "/downloads/Tatiana": '/Tatiana/',
    "/downloads/transmission": '/Transmission/',
}

const predefinedFoldersByLength = Object.keys(predefinedFolders).sort((a, b) => {
    return (b.match(/\//g) || []).length - (a.match(/\//g) || []).length
})

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

    renderLocationSelect() {
        const activePath = predefinedFoldersByLength.find((i) => (this.state.value || '').startsWith(i)) || ''
        const activeSuffix = this.state.value.replace(new RegExp(`^${activePath.replace('/', '\\/')}/?`), '') || ''
        return (
            <div>
                <div style={{display: 'flex'}}>
                    <div>
                        <label htmlFor={'base-location-select'}
                               style={{display: 'block', fontSize: '1rem', marginBottom: '0.25rem'}}>Base
                            location</label>
                        <select id="base-location-select" onChange={(e) => {
                            if (activeSuffix) {
                                this.onChange(`${e.target.value}/${activeSuffix}`)
                            } else {
                                this.onChange(e.target.value)
                            }
                        }} style={{fontSize: '1rem'}}>
                            {Object.entries(predefinedFolders).map(([path, label]) => (
                                <option key={path} selected={activePath === path} value={path}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <Input type='text' label="Subdirectory (optional)" id={"location-suffix-input"}
                           onChange={(newSuffix) => {
                               this.onChange(`${activePath}/${newSuffix.replace(/^\//, '').replace(/[^a-z0-9/\-]/gi, '_')}`)
                           }}
                           value={activeSuffix}
                           style={{padding: 0}}
                    />
                </div>
                <Input readOnly value={this.state.value}/>
            </div>
        )
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
                                this.renderLocationSelect())
                            : (<Input type='text' label={this.props.question && this.props.question}
                                      onChange={this.onChange} value={this.state.value}/>)}

                    </div>
                </div>
            </Dialog>
        );
    }
}

export default PromptDialog;
