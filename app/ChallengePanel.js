import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import WallPanel from './WallPanel';


const styles = theme => ({
  challenge_panel: {
    width: '100%',
  },
  wallname: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  walldesc: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ChallengePanel extends React.Component {
  state = {
    expanded: null,
    walls: [],
    grades: [],
  };
  
  componentDidMount = () => {
    fetch('/walls', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.log(responseJson.error);
      } else {
        this.setState({walls: responseJson.data});
      }
    })
    .catch((error) => {
      console.log(error);
    });
    fetch('/grades', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.log(responseJson.error);
      } else {
        this.setState({grades: responseJson.data});
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes, user } = this.props;
    const { expanded, walls } = this.state;

    return (
      <div className={classes.challenge_panel}>
        {walls.map( (wall) => {
          return <ExpansionPanel key={wall.id} expanded={expanded === wall.id} onChange={this.handleChange(wall.id)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.wallname}>{wall.name}</Typography>
              <Typography className={classes.walldesc}>{wall.description}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              { expanded === wall.id ?
                <WallPanel wall_id={wall.id} user={user} walls={this.state.walls} grades={this.state.grades} /> : "" }
            </ExpansionPanelDetails>
          </ExpansionPanel>
          })
        }
      </div>
    );
  }
}

export default withStyles(styles)(ChallengePanel);
