 export interface HeadingPropertiesDefaults {
    color: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string | number;
    textTransform: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
    textDecoration: 'underline' | 'overline' | 'line-through' | 'none';
    letterSpacing: string;
    lineHeight: string;
    textAlign: 'left' | 'center' | 'right';
    textStroke?: string; 
  } 
  export const getHeadingPropertiesDefaults = (): HeadingPropertiesDefaults=> ({
    color: 'black', 
    fontFamily: 'Arial, sans-serif', 
    fontSize: '22px', 
    fontWeight: '400', 
    textTransform: 'capitalize', 
    textDecoration: 'none', 
    letterSpacing: '0px', 
    lineHeight: '10px', 
    textAlign: 'center',
    textStroke: '0px #333', 
  })