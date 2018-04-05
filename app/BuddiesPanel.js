import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import FaceIcon from 'material-ui-icons/Face';


const styles = theme => ({
  grid: {
    width: '100%',
    margin: 0,
  },
  panel: theme.mixins.gutters({
    //padding: 16,
    margin: theme.spacing.unit * 3 + 'px auto',
  }),
  
});

class BuddiesPanel extends React.Component {
  state = {
    ranking_data_loaded: false,
    ranking_data: [],
    latest_events_loaded: false,
    latest_events: [],
  };
  
  componentDidMount() {
    fetch('/ranking', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.error(responseJson.error);
        this.setState( { ranking_data_loaded: true, ranking_data: [] } );
      } else {
        this.setState( { ranking_data_loaded: true, ranking_data: responseJson.data } );
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState( { ranking_data_loaded: true, ranking_data: [] } );
    });
    
    fetch('/latest', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.error(responseJson.error);
        this.setState( { latest_events_loaded: true, latest_events: [] } );
      } else {
        this.setState( { latest_events_loaded: true, latest_events: responseJson.data } );
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState( { latest_events_loaded: true, latest_events: [] } );
    });
  }

  render() {
    const { classes } = this.props;
    
    let n_events = 0;
    
    return (
      <Grid container spacing={24} className={classes.grid}>
        <Grid item xs>
          <Paper className={classes.panel} elevation={4}>
            <Typography variant="title" align="center">
              Classement
            </Typography>
            { this.state.ranking_data_loaded ?
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Grimpeur</TableCell>
                  <TableCell numeric>Points</TableCell>
                  <TableCell numeric>Catégorie</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.ranking_data.map(n => {
                  return (
                    <TableRow key={n.id}>
                      <TableCell>
                        <Chip avatar={
                          <Avatar src={n.picture} alt={n.displayName} >
                            {n.picture ? '' : <FaceIcon /> }
                          </Avatar>}
                          label={n.displayName}
                        />
                      </TableCell>
                      <TableCell numeric>{n.points}</TableCell>
                      <TableCell>{n.category}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            : <CircularProgress />
            }
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.panel} elevation={4}>
            <Typography variant="title" align="center">
              Dernières réussites
            </Typography>
          
            { this.state.latest_events_loaded ?
              <Table className={classes.table}>
              <TableBody>
                {this.state.latest_events.map(n => {
                  return (
                    <TableRow key={n_events++}>
                      <TableCell>
                        <Chip avatar={
                          <Avatar src={n.picture} alt={n.displayName} >
                            {n.picture ? '' : <FaceIcon /> }
                          </Avatar>}
                          label={n.displayName}
                        /> <Typography style={{display:'inline-block'}} noWrap>a passé le bloc {n.color} </Typography><Typography noWrap style={{display: 'inline-block', backgroundColor: n.gradecolor}}>&nbsp;{n.gradename}&nbsp;</Typography><Typography noWrap style={{display:'inline-block'}}> sur le pan {n.wallname}</Typography>
                      </TableCell>
                      
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            : <CircularProgress />
            }
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(BuddiesPanel);
