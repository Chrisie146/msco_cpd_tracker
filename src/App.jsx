import CPDTracker from './CPDTracker'

function App() {
  console.log('App component rendering...');
  
  try {
    return (
      <div>
        <CPDTracker />
      </div>
    )
  } catch (error) {
    console.error('Error in App:', error);
    return <div>Error: {error.message}</div>
  }
}

export default App
