import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: '60vw',
    height: 400,
    margin:'auto',
    background: 'rgb(0,0,0,0.1)',
    padding: '5vw'
   
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  background:{
    position: 'absolute',
    zIndex: -1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "url('assets/imgs/background8.gif')",
    opacity: .3,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
  },
 
});

// https://www.rapidtables.com/web/color/RGB_Color.html

export default function SimpleCard({text}) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={`card ${classes.root}`}>
      {/* <div className="bg"></div> */}
      <CardContent >
      {/* <div className="bg"></div> */}
        <Typography variant="h5" component="h2">
        {text}
        </Typography>
        
      </CardContent>
      
    </Card>
  );
}
