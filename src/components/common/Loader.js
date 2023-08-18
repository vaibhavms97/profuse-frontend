import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export default function Loader() {
  return (
    <Box
      height='100vh'
      width='100vw'
      display='flex'
      alignItems='center'
      justifyContent='center'
      top='0'
      left='0'
      position='fixed'
      zIndex='1400'
      sx={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <CircularProgress size={'5rem'} />
    </Box>
  )
}