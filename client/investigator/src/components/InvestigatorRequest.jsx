import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    ButtonGroup,
    Button,
    Card,
    CardContent,
    Grid,
    Box,
    Chip,
    useTheme,
    useMediaQuery,
    Stack,
    Divider
  } from '@mui/material';
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';
  import CancelIcon from '@mui/icons-material/Cancel';
  import PendingIcon from '@mui/icons-material/Pending';
  import ThumbUpIcon from '@mui/icons-material/ThumbUp';
  import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function InvestigatorRequest( investigatorEmail ) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]); // State to hold filtered requests
    const [statusFilter, setStatusFilter] = useState("Pending"); // State to track the current filter

    // Fetch pending requests for the specified admin email
    useEffect(() => {
        async function displayRequests() {
            try {
                const res = await axios.get('http://localhost:8000/api/investigator/pendingRequests', {
                    params: { investigatorEmail:investigatorEmail }
                });
                setRequests(res.data);
                console.log(requests);
                setFilteredRequests(res.data.filter(request => request.status === statusFilter)); // Initial filter
                console.log(res.data);
            } catch (err) {
                console.error("Error fetching requests:", err);
            }
        }

        displayRequests();
    }, [investigatorEmail]); 

    // Update filtered requests when status filter changes
    useEffect(() => {
        setFilteredRequests(requests.filter(request => request.status === statusFilter));
    }, [statusFilter, requests]);

    const getStatusChip = (status) => {
        const statusProps = {
            Pending: { icon: <PendingIcon />, color: 'warning' },
            Accepted: { icon: <CheckCircleIcon />, color: 'success' },
            Declined: { icon: <CancelIcon />, color: 'error' }
        };
        
        return (
            <Chip 
                icon={statusProps[status].icon}
                label={status}
                color={statusProps[status].color}
                size="small"
                sx={{ fontWeight: 500 }}
            />
        );
    };
    const FilterButtons = () => (
        <Box sx={{ mb: 4 }}  fontFamily={"'Lexend Deca', sans-serif"}>
            {isMobile ? (
                <Stack spacing={1} width="100%"  fontFamily={"'Lexend Deca', sans-serif"}>
                    <Button 
                        startIcon={<PendingIcon />}
                        onClick={() => setStatusFilter("Pending")}
                        variant={statusFilter === "Pending" ? "contained" : "outlined"}
                        sx={{ color: '#1a237e' }}
                        fullWidth
                        fontFamily={"'Lexend Deca', sans-serif"}
                    >
                        Pending
                    </Button>
                    <Button 
                     fontFamily={"'Lexend Deca', sans-serif"}
                        startIcon={<CheckCircleIcon />}
                        onClick={() => setStatusFilter("Accepted")}
                        variant={statusFilter === "Accepted" ? "contained" : "outlined"}
                        sx={{ color: '#1a237e' }}
                        fullWidth
                    >
                        Accepted
                    </Button>
                    <Button 
                     fontFamily={"'Lexend Deca', sans-serif"}
                        startIcon={<CancelIcon />}
                        onClick={() => setStatusFilter("Declined")}
                        variant={statusFilter === "Declined" ? "contained" : "outlined"}
                        sx={{ color: '#1a237e' }}
                        fullWidth
                    >
                        Declined
                    </Button>
                </Stack>
            ) : (
                <ButtonGroup variant="outlined">
                    <Button 
                        startIcon={<PendingIcon />}
                        onClick={() => setStatusFilter("Pending")}
                        variant={statusFilter === "Pending" ? "contained" : "outlined"}
                        sx={{ color: statusFilter === "Pending" ? 'white' : '#1a237e' ,
                            fontFamily:"'Lexend Deca', sans-serif"
                        }}
                    >
                        Pending
                    </Button>
                    <Button 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => setStatusFilter("Accepted")}
                        variant={statusFilter === "Accepted" ? "contained" : "outlined"}
                        sx={{ color: statusFilter === "Accepted" ? 'white' : '#1a237e' ,
                            fontFamily:"'Lexend Deca', sans-serif"
                        }}
                    >
                        Accepted
                    </Button>
                    <Button 
                        startIcon={<CancelIcon />}
                        onClick={() => setStatusFilter("Declined")}
                        variant={statusFilter === "Declined" ? "contained" : "outlined"}
                        sx={{ color: statusFilter === "Declined" ? 'white' : '#1a237e',
                            fontFamily:"'Lexend Deca', sans-serif"
                         }}
                    >
                        Declined
                    </Button>
                </ButtonGroup>
            )}
        </Box>
    );

    return (
        <Container 
            maxWidth="xl" 
            sx={{ 
                py: { xs: 2, sm: 3 },
                px: { xs: 1, sm: 2 },
                width: '100%',
                maxWidth: '100% !important'
            }}
        >
            <Paper 
                elevation={3}
                sx={{ 
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2
                }}
            >
                <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                        mb: 3,
                        fontWeight: 600,
                        fontFamily:"'Lexend Deca', sans-serif",
                        color: theme.palette.primary.main 
                    }}
                >
                   My Requests
                </Typography>

                <FilterButtons />

                {filteredRequests.length === 0 ? (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography color="textSecondary" align="center"fontFamily={"'Lexend Deca', sans-serif"}>
                                No requests found.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {filteredRequests.map(request => (
                            <Grid item xs={12} key={request._id}>
                                <Card 
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        '&:hover': {
                                            boxShadow: theme.shadows[2],
                                            transition: 'box-shadow 0.3s ease-in-out'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={8}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                        Project Code: {request.projectCode}
                                                    </Typography>
                                                    {getStatusChip(request.status)}
                                                </Box>
                                                
                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="subtitle2" color="textSecondary">
                                                            Field to Update
                                                        </Typography>
                                                        <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="body1">
                                                            {request.fieldToUpdate}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="subtitle2" color="textSecondary">
                                                            New Value
                                                        </Typography>
                                                        <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="body1">
                                                            {request.newValue}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>

                                                <Divider sx={{ my: 2 }} />

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="subtitle2" color="textSecondary">
                                                        Message
                                                    </Typography>
                                                    <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="body1">
                                                        {request.message}
                                                    </Typography>
                                                </Box>

                                                <Typography fontFamily={"'Lexend Deca', sans-serif"}variant="subtitle2" color="textSecondary">
                                                    Requested By
                                                </Typography>
                                                <Typography fontFamily={"'Lexend Deca', sans-serif"} variant="body1">
                                                    {request.investigatorEmail}
                                                </Typography>
                                            </Grid>
                                            {request.status === "Pending" && (
                                                <Grid item xs={12} sm={4} sx={{ 
                                                    display: 'flex', 
                                                    flexDirection: { xs: 'row', sm: 'column' },
                                                    gap: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'stretch'
                                                }}>
                                                   
                                                  
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Container>
    );
}

export default InvestigatorRequest;
