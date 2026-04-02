import { useState } from 'react';
import {
    Box, Typography, IconButton, Collapse, Divider, Chip,
    List, ListItemButton, ListItemIcon, ListItemText, Avatar,
    TextField, Button
} from '@mui/material';
import { ChevronDown, ChevronUp, Plus, Flame } from 'lucide-react';
import { useLabels, useCreateLabel } from '../hooks/useLabels';

const FiltersLabelsPage = () => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(true);
    const { data: labels = [] } = useLabels("1");

    const createLabelMutation = useCreateLabel();
    const [isCreating, setIsCreating] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#1976D2');

    const presetColors = ['#1976D2', '#D32F2F', '#388E3C', '#F57C00', '#7B1FA2', '#808080'];

    const [isLabelsOpen, setIsLabelsOpen] = useState(true);

    const handleSave = async () => {
        try {
            await createLabelMutation.mutateAsync({
                name: newLabelName.trim(),
                color: newLabelColor,
                userId: "1"
            });
            setNewLabelName('');
            setNewLabelColor('#1976D2');
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to create label", error);
        }
    };


    return (
        <Box sx={{ maxWidth: 700 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 4 }}>
                Filters & Labels
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                            {isFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </IconButton>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#1976D2', fontSize: '0.8rem' }}>
                            T
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            My Filters
                        </Typography>
                        <Chip
                            label="USED: 2/3"
                            size="small"
                            sx={{ fontWeight: 600, height: 22, fontSize: '0.7rem', color: 'text.secondary' }}
                        />
                    </Box>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <Plus size={20} />
                    </IconButton>
                </Box>

                <Collapse in={isFiltersOpen}>
                    <List sx={{ py: 0 }}>
                        <ListItemButton sx={{ borderRadius: 1, pl: 7 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <Flame size={18} sx={{ color: 'text.secondary' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Assigned to me"
                                primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.primary' }}
                            />
                        </ListItemButton>
                        <Divider variant="inset" sx={{ ml: 7 }} />

                        <ListItemButton sx={{ borderRadius: 1, pl: 7 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <Flame size={18} sx={{ color: 'text.secondary' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Priority 1"
                                primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.primary' }}
                            />
                        </ListItemButton>
                    </List>
                </Collapse>
            </Box>

            <Box>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => setIsLabelsOpen(!isLabelsOpen)}>
                            {isLabelsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </IconButton>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            Labels
                        </Typography>
                    </Box>
                    <IconButton
                        size="small"
                        sx={{ color: 'text.secondary' }}
                        onClick={() => setIsCreating(true)}
                    >
                        <Plus size={20} />
                    </IconButton>
                </Box>

                <Collapse in={isCreating}>
                    <Box sx={{ pl: 7, mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Label name"
                            variant="standard"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            autoFocus
                            InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem' } }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newLabelName.trim()) handleSave();
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {presetColors.map((color) => (
                                    <Box
                                        key={color}
                                        onClick={() => setNewLabelColor(color)}
                                        sx={{
                                            width: 20, height: 20, borderRadius: '50%', bgcolor: color,
                                            cursor: 'pointer', border: newLabelColor === color ? '2px solid black' : '1px solid lightgrey',
                                            transition: 'border 0.1s ease'
                                        }}
                                    />
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" onClick={() => { setIsCreating(false); setNewLabelName(''); }}>Cancel</Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    disabled={!newLabelName.trim() || createLabelMutation.isPending}
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Collapse>

                <Collapse in={isLabelsOpen}>
                    {labels.length === 0 ? (
                        <Box sx={{ pl: 7, mt: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                                Your list of labels will show up here.
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ py: 0 }}>
                            {labels.map((label) => (
                                <ListItemButton key={label.id} sx={{ borderRadius: 1, pl: 7 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                bgcolor: label.color || '#808080',
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={label.name}
                                        primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.primary' }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </Collapse>
            </Box>
        </Box>
    );
};

export default FiltersLabelsPage;