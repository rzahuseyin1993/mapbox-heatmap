import React from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import Main from "./Main.js";

let theme = createTheme({
  components:{
    MuiPaper:{
      styleOverrides: {
        root: {
          padding:10,
          boxShadow:'0px 24px 48px -4px #06192114'
        },
      },
    },
    MuiTypography:{
      styleOverrides: {
        root:{
           lineHeight:'normal',
           wordBreak:'break-all'
        }
     }
    },
    MuiButton:{
      styleOverrides: {
         root:{
            padding:'16px 20px',
            borderRadius:50,
            lineHeight:'normal',
            textTransform:'none'
         }
      }
    },
    MuiTextField:{
      styleOverrides: {
        root: {
          boxSizing:'border-box'
        },
      },
    },
    MuiOutlinedInput:{
      styleOverrides: {
        root:{
           padding:'0 16px',
           borderRadius:72,
           backgroundColor:'#f1f6fa'
        },
        input:{
           padding:'10px 8px',
           color:'#162c36'
        },
        notchedOutline: {
          border:0
        },
      },
   },
   MuiDialog:{
    styleOverrides: {
       root:{
          '& .MuiDialog-paper':{
             width:480,
             paddingTop:20,
             paddingBottom:20,
             paddingLeft:30,
             paddingRight:30
          }
       }
    }
   },
   MuiDialogTitle:{
    styleOverrides: {
       root:{
          //marginBottom: 20,
          borderBottom:'1px solid #e3ebf1'
       }
    }
   },
   MuiDialogContent:{
    styleOverrides: {
       root:{
          padding: 10
       }
    }
   },
   MuiDialogActions:{
    styleOverrides: {
       root:{
          padding:20
       }
    }
   },
 }
});

theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
       <Main />
    </ThemeProvider>
  );
}

export default App;