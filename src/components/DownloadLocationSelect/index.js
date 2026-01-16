import React from "react";
import Input from "react-toolbox/lib/input";

const predefinedFolders = {
    "/downloads": '/downloads',
    "/downloads/benno": '/benno/',
    "/downloads/benno/switch": '/benno/switch/',
    "/downloads/tanya": '/tanya/',
    "/downloads/tanya/audiobooks": '/tanya/audiobooks',
    "/downloads/plex/anime": '/plex/anime/',
    "/downloads/plex/movies": '/plex/movies/',
    "/downloads/plex/series": '/plex/series/',
}

const predefinedFoldersByLength = Object.keys(predefinedFolders).sort((a, b) => {
    return (b.match(/\//g) || []).length - (a.match(/\//g) || []).length
})

export default function DownloadLocationSelect(props) {
    const {value = '', onChange, onBlur, tooltip} = props
    const activePath = predefinedFoldersByLength.find((i) => (value || '').startsWith(i)) || ''
    const activeSuffix = value.replace(new RegExp(`^${activePath.replace('/', '\\/')}/?`), '') || ''
    return (
        <div>
            <div style={{display: 'flex'}}>
                <div>
                    <label htmlFor={'base-location-select'}
                           style={{display: 'block', fontSize: '1rem', marginBottom: '0.25rem'}}>Base
                        location</label>
                    <select id="base-location-select" onChange={(e) => {
                        if (activeSuffix) {
                            onChange(`${e.target.value}/${activeSuffix}`)
                            onBlur(`${e.target.value}/${activeSuffix}`)
                        } else {
                            onChange(e.target.value)
                            onBlur(e.target.value)
                        }
                    }} style={{fontSize: '1rem'}}>
                        {Object.entries(predefinedFolders).map(([path, label]) => (
                            <option key={path} selected={activePath === path} value={path}>{label}</option>
                        ))}
                    </select>
                </div>
                <Input type='text' label="Subdirectory (optional)" id={"location-suffix-input"}
                       icon="folder"
                       onChange={(newSuffix) => {
                           onChange(`${activePath}/${newSuffix.replace(/^\//, '').replace(/[^a-z0-9/\-]/gi, '_')}`)
                       }}
                       value={activeSuffix}
                       style={{padding: 0}}
                       onBlur={e => onBlur(`${activePath}/${activeSuffix}`)}
                       floating={true}
                />
                <span style={{margin: 'auto 0'}}>{tooltip}</span>
            </div>
        </div>
    )
}