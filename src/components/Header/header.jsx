import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


export default function TemporaryDrawer() {

  return (
    <div  className="greeting">
      {/* {['Home'].map((anchor) => (
        <React.Fragment key={anchor} style={{ margin: 'auto'}}>
          <Button >{anchor}</Button>
          
        </React.Fragment>
      ))} */}
      {/* <Typography variant="h5" component="h2" className="text">
        Hello
        </Typography> */}
        <p className="text"> Hello</p>
      
    </div>
  );
}