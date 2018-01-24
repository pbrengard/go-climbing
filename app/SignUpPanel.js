import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';


const styles = theme => ({
  panel: theme.mixins.gutters({
    width: '50%',
    padding: 16,
    margin: theme.spacing.unit * 3 + 'px auto',
  }),
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 16,
    'flex-direction': 'column',
  },
  input: {
    margin: theme.spacing.unit,
  },
  disclaimer: {
    margin: theme.spacing.unit * 2,
  },
  error: {
    margin: theme.spacing.unit * 2,
  },
});

class SignUpPanel extends React.Component {
  state = {
    error: null,
    error_name: false,
    error_email: false,
    error_passwd: false,
    
  };
  
  signup = () => {
    if (!this.user_value) {
      return this.setState({error_name: true});
    }
    if (!this.email_value) {
      return this.setState({error_email: true});
    }
    if (!this.passwd_value) {
      return this.setState({error_passwd: true});
    }
    
    fetch('/auth/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayname: this.user_value,
        username: this.email_value,
        password: this.passwd_value,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == 'error') {
        this.setState({ error: responseJson.error.message });
      } else {
        
      }
    })
    .catch((error) => {
      this.setState({ error: error });
    });
  }
  
  render() {
    const { classes } = this.props;
    
    return (
        <Paper className={classes.panel} elevation={4}>
          <Typography type="headline" component="h3">
            Créer un compte
          </Typography>
          
          <div className={classes.container}>
            <TextField required error={this.state.error_name} onChange={e => {this.user_value = e.target.value}}
              className={classes.input}
              label="Nom d'utilisateur"
            />
            <TextField required error={this.state.error_email} onChange={e => {this.email_value = e.target.value}}
              className={classes.input}
              type="email"
              autoComplete="email"
              label='adresse e-mail'
            />
            <TextField required error={this.state.error_passwd} onChange={e => {this.passwd_value = e.target.value}}
              className={classes.input}
              type="password"
              autoComplete="current-password"
              label='Mot de passe'
            />
            {this.state.error ?
              <Typography component="p" className={classes.error} color='error' >
                {this.state.error}
              </Typography>
              :
              <Typography component="p" className={classes.disclaimer} >
                go-climbing n'utilisera votre adresse e-mail que pour les besoins du site, et ne la partagera ou vendra pas à d'autres entités.
              </Typography>
            }
            <Button onClick={this.signup} raised color="primary">
              Inscription
            </Button>
          </div>
        </Paper>
    );
  }
}

export default withStyles(styles)(SignUpPanel);
