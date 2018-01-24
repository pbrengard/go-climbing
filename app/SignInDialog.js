import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
  other_button: {
    margin: theme.spacing.unit,
  }
});

class SignInDialog extends React.Component {
  state = {
    open: false,
    error: null,
  };

  show = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ open: false, error: null });
  };
  
  signin = () => {
    
    fetch('/auth/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.user_value,
        password: this.passwd_value,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        this.setState({ error: responseJson.error.message });
      } else {
        close();
      }
    })
    .catch((error) => {
      this.setState({ error: error });
    });
  };
  
  googleLogin = () => {
    fetch('/auth/google', {
      method: 'GET',
      mode: "no-cors",
      headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',  
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        this.setState({ error: responseJson.error.message });
      } else {
        close();
      }
    })
    .catch((error) => {
      this.setState({ error: error });
    });
    
  };

  render() {
    const { classes } = this.props;
    
    return (
        <Dialog
          open={this.state.open}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Connexion</DialogTitle>
          <DialogContent>
            {this.state.error ?
            <DialogContentText style={{color: 'red'}}>
              {this.state.error}
            </DialogContentText>
            :
            <DialogContentText>
              Entrez e-mail et mot de passe
            </DialogContentText>
            }
          <FormControl className={classes.container}>
            <Input onChange={e => {this.user_value = e.target.value}}
              placeholder="Adresse e-mail"
              className={classes.input}
              type="email"
              autoComplete="email"
              inputProps={{
                'aria-label': 'E-mail',
              }}
            />
            <Input onChange={e => {this.passwd_value = e.target.value}}
              placeholder="Mot de passe"
              className={classes.input}
              type="password"
              autoComplete="current-password"
              inputProps={{
                'aria-label': 'Mot de passe',
              }}
            />
          </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close} raised color="primary">
              Annuler
            </Button>
            <Button onClick={this.signin} raised color="primary">
              OK
            </Button>
          </DialogActions>
          <Typography type="headline" component="h3" align="center">
            - ou -
          </Typography>
          <Button href="/auth/google" raised color="primary" className={classes.other_button}>
              Connexion avec Google
          </Button>
        </Dialog>
    );
  }
}

export default withStyles(styles)(SignInDialog);
