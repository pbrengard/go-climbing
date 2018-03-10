import React from 'react';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from "material-ui/Form";
import Input, { InputLabel } from "material-ui/Input";
import Snackbar from 'material-ui/Snackbar';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';

const create = (type, ...data) => {
  return {
    type,
    data,
    fold: definitions => {
      return definitions[type](data.length>0 ? data[0] : undefined);
    },
  };
};

const remoteData = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  FAILURE: 'FAILURE',
  SUCCESS: 'SUCCESS',
  init: () => create(remoteData.NOT_LOADED),
  loading: () => create(remoteData.LOADING),
  failure: error => create(remoteData.FAILURE, error),
  success: data => create(remoteData.SUCCESS, data),
};

const fakeFetch = () => {
  return new Promise(res => {
    setTimeout(() => res({ data: [{ id: 1, name: 'foo' }] }), 1000);
  });
};

const styles = theme => ({
  list_routes: {
    width: '100%',
  },
  button_add: {
    //position: 'absolute',
    //top: theme.spacing.unit * 2,
    //right: theme.spacing.unit * 4,
  },
  formControl: {
    //margin: theme.spacing.unit * 3,
  }
});

class WallPanel extends React.Component {
  state = { 
    data: remoteData.init(),
    dialog_add_open: false,
    dialog_add_data: {
      color: "",
      wall_id: this.props.wall_id,
      grade_id: 0,
      creator: this.props.user.displayName,
      created: new Date(),
    },
    dialog_add_snack_open : false,
    dialog_add_snack_text : "",
  };
  
  componentDidMount() {
    this.fetch();
  }
  
  getWallBlocs = () => {
    return fetch('/routes/'+this.props.wall_id, {
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
        this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : responseJson.error.message });
        return { data: [] };
      } else {
        return responseJson;
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : error });
    });
  }
  
  fetch = async () => {
    try {
      this.setState({ data: remoteData.loading() });
      const result = await this.getWallBlocs();
      this.setState({ data: remoteData.success(result.data) });
    } catch (e) {
      this.setState({ data: remoteData.failure(e) });
    }
  };
  
  openAddDialog = (user) => () => {
    this.setState({ dialog_add_open: true });
  }
  
  closeAddDialog = () => {
    this.setState({ dialog_add_open: false });
  };
  
  handleDialogAddSnackbarClose= () => {
    this.setState({ dialog_add_snack_open: false });
  };
  
  
  handleDialogAddChange = event => {
    let d = this.state.dialog_add_data;
    d[event.target.name] = event.target.value;
    this.setState({ dialog_add_data: d });
  };
  
  validateAddedBloc = () => {
    let d = this.state.dialog_add_data;
    if (!d.color || d.color.length == 0) {
      this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : "Pas de couleur couleur" });
      return false;
    }
    if (d.wall_id == 0) {
      this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : "Pas de pan" });
      return false;
    }
    if (d.wall_id == 0) {
      this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : "Pas de difficulté" });
      return false;
    }
    return true;
  }
  
  addNewRoute = () => {
    if( !this.validateAddedBloc()) {
      return;
    }
    fetch('/routes/add', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.dialog_add_data),
    }).then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.log(responseJson.error);
        this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : responseJson.error });
      } else {
        this.closeAddDialog();
        this.fetch();
        this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : responseJson.data });
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : error });
    });
  };
  
  handleToggleRoute = route_id => (event, checked) => {
    fetch('/routes/pass', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({route: route_id, passed: checked}),
    }).then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.log(responseJson.error);
        this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : responseJson.error });
      } else {
        this.fetch();
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : error });
    });
  };
  
  closeRoute = route_id => () => {
    fetch('/routes/close', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({route: route_id}),
    }).then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        console.log(responseJson.error);
        this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : responseJson.error });
      } else {
        this.fetch();
        this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : responseJson.data });
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({ dialog_add_snack_open: true, dialog_add_snack_text : error });
    });
  };
  
  render() {
    const { classes, user, wall_id, walls, grades } = this.props;
    const { data } = this.state;
    
    let add_button = user.is_admin ?
      <Button variant="fab" mini aria-label="add" className={classes.button_add} color="primary" onClick={this.openAddDialog(user)}>
        <AddIcon />
      </Button> :
      '';
      
    return (
      <div className={classes.list_routes}>
        {data.fold({
          NOT_LOADED: () => <div>Not Loaded</div>,
          LOADING: () => <CircularProgress />,
          FAILURE: error => <div>An error has happened</div>,
          SUCCESS: data => {
           return (
            <List className={classes.list_routes}>
              {add_button}
              {data.map(dat => (
                <ListItem key={dat._id} className={classes.listItem}>
                  <Checkbox
                      onChange={this.handleToggleRoute(dat._id)}
                      checked={dat.passed}
                  />
                  <ListItemText
                    //style={{backgroundColor: 'red'}} 
                    //primary={dat.color + " <font style='color:red;'>in red</font>"}
                    //secondary={"ouvert "+(dat.creator && dat.creator.length>0 ? "par "+dat.creator : "") +"le "+(new Date(dat.created)).toDateString()}
                  disableTypography
                    primary={<div><Typography noWrap component='bdi' style={{display: 'inline', float:'left'}}>{dat.color}</Typography>
                        <Typography noWrap component='bdi' align='right' style={{display: 'inline', float:'right', backgroundColor: grades[dat.grade_id].color}}>&nbsp;{grades[dat.grade_id].name}&nbsp;</Typography>
                        <div style={{clear: 'both'}}></div>
                        </div>}
                    secondary={<Typography color='textSecondary'>{"ouvert "+(dat.creator && dat.creator.length>0 ? "par "+dat.creator : "") +" le "+(new Date(dat.created)).toDateString()}</Typography>}
                  />
                  {user.is_admin ?
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={this.closeRoute(dat._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                  : <div />
                  }
                </ListItem>
              ))}
            </List>
            
          )},
        })}
      
      <Dialog
          open={this.state.dialog_add_open}
          onClose={this.closeAddDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Ajouter un bloc</DialogTitle>
          <DialogContent>
            <DialogContentText>
              
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="color"
              label="Couleur"
              type="text"
              fullWidth
              required
              onChange={this.handleDialogAddChange}
              inputProps={{
                name: 'color',
                id: 'color-id',
              }}
            />
          
          <FormControl required fullWidth margin="dense" className={classes.formControl} >
            <InputLabel htmlFor="wall-id">Pan</InputLabel>
            <Select
              value={this.state.dialog_add_data.wall_id}
              onChange={this.handleDialogAddChange}
              displayEmpty
              inputProps={{
                name: 'wall_id',
                id: 'wall-id',
              }}
            >
              {walls.map( (wall) => {
                return <MenuItem value={wall.id} key={wall.id} >{wall.name}</MenuItem>
              })}
            </Select>
          </FormControl>
          
          <FormControl required fullWidth margin="dense" className={classes.formControl}>
            <InputLabel htmlFor="grade-id">Difficulté</InputLabel>
            <Select
              value={this.state.dialog_add_data.grade_id}
              onChange={this.handleDialogAddChange}
              displayEmpty
              inputProps={{
                name: 'grade_id',
                id: 'grade-id',
              }}
              style={{backgroundColor: grades[this.state.dialog_add_data.grade_id].color}}
            >
              {grades.map( (grade) => {
                return <MenuItem style={{backgroundColor: grade.color}} value={grade.id} key={grade.id} >{grade.name}</MenuItem>
              })}
            </Select>
          </FormControl>
          
          <TextField
              defaultValue={user.displayName}
              margin="dense"
              id="creator"
              label="Ouvreur"
              type="text"
              fullWidth
              
              onChange={this.handleDialogAddChange}
              inputProps={{
                name: 'creator',
                id: 'creator-id',
              }}
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={this.closeAddDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={this.addNewRoute} color="primary">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar
          open={this.state.dialog_add_snack_open}
          autoHideDuration={4000}
          onClose={this.handleDialogAddSnackbarClose}
          SnackbarContentProps={{
            'aria-describedby': 'snackbar-fab-message-id',
            className: classes.snackbarContent,
          }}
          message={<span id="snackbar-fab-message-id">{this.state.dialog_add_snack_text}</span>}
          action={
            <Button color="inherit" size="small" onClick={this.handleDialogAddSnackbarClose}>
              OK
            </Button>
          }
          className={classes.snackbar}
        />
        
      </div>
    );
  }
}

/*
<h3>User List</h3>
        {data.fold({
          NOT_LOADED: () => <div>Not Loaded</div>,
          LOADING: () => <div>Loading...</div>,
          FAILURE: error => <div>An error has happened</div>,
          SUCCESS: data => (
            <ul>
              {data.map(dat => (
                <li key={dat.id}>{dat.name}</li>
              ))}
            </ul>
          ),
        })}
*/

export default withStyles(styles)(WallPanel);