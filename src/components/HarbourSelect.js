import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { harbours } from '../base/points/harbours';

export default function HarbourSelect({ nexWorld }) {
    const [harbour, setHarbour] = useState('');

    const handleChange = (event) => {
        setHarbour(event.target.value);
        nexWorld.location = [harbours[event.target.value].coordinates[0], -harbours[event.target.value].coordinates[1]];
        nexWorld.evt.dispatchEvent(
            new CustomEvent("nexWorld-location-update", {
                detail: [harbours[event.target.value].coordinates[0], -harbours[event.target.value].coordinates[1]],
            })
        );
        nexWorld.center();

    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Harbour</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={harbour}
                    label="Harbour"
                    onChange={handleChange}
                >
                    {Object.keys(harbours).map((harbour) => (
                        <MenuItem key={harbour} value={harbour}>{harbour}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}