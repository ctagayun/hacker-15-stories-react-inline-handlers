/*================================================================
 Inline Handlers
    Task: The application renders a list of items and allows its 
  users to filter the list via a search feature. Next the application 
  should render a button next to each list item which allows its users 
  to remove the item from the list.. 

  Optional Hints:

    1. The list of items needs to become a stateful value in order to 
       manipulate it (e.g. removing an item) later.
    2. Every list item renders a button with a click handler. When 
       clicking the button, the item gets removed from the list by manipulating 
       the state.
    3. Since the stateful list resides in the App component, one needs 
       to use callback handlers to enable the Item component to communicate 
       up to the App component for removing an item by its identifier.
 

  Review what is useState?
      - When a state gets mutated, the component with the state 
      and all child components will re-render.

  Review what is useEffect?
    - What does useEffect do? by using this hook you tell React that 
     your component needs to do something after render.

=============================================*/

import * as React from 'react';
    const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ]

  //Create a custom hook called "useStorageState". We will use two hooks 
  //to create it:
  //    1. useState
  //    2. useEffect 
  
  //This is a custom hook that will store the state in a 
  //local storage. useStorageState which will keep the component's 
  //state in sync with the browser's local storage.

  /*This new custom hook returns
      1. state 
      2. and a state updater function
   and accepts an initial state as argument. 
  */
    
  const useStorageState = (key, initialState) => {
     //using the the parameter 'key'. it goes to the local storage
     //to fetch the state if not found uses the parameter 'initialState' 
     //and assigns it to "value" otherwise the state fetched from
     //local storage will be used and assigned to 'value
     //   Note: 1. value is the generic name for state
     //         2. setValue is the name of the function that will 
     //            update the 'value'
 
     /* This is the custom hook before it was refactored to make it generic:
     const [searchTerm, setSearchTerm] = React.useState(''); 
          1. searchTerm renamed to 'value'
          2. setSearchTerm renamed to 'setValue'
      */
     const [value, setValue] = React.useState(
        localStorage.getItem('key') || initialState 
     );
     
     React.useEffect(() => {
       console.log('useEffect fired. Displaying value of dependency array ' + [ value, key]  );

       /* The following code is the first parameter of useEffect - a function.
          This function looks for an item in the localStorage using "key".
          Key is a generic it contains the value "search" of 'search/value' 
          and set 'value' to 'searchTerm' which is the state 
       */
         localStorage.setItem(key, value);  
        },
        [value, key]  
        ); //EOF useEffect
    
     //the returned values are returned as an array.
     //to make it generic change [searchTerm, setSearchTerm] to [value , setValue]
     //Again: searchTerm is the state. setSearchTerm is the state updater
     //function.
     return [value, setValue]; 

  } //EOF create custom hook
  
 const App = () => { 
      //Call custom useStorageState hook to assign value to searchTerm, setSearchTerm
      const [searchTerm, setSearchTerm] =  useStorageState (
        'search', //key
        'React',  //Initial state
        );
      console.log('Value assigned to search term is = ' + searchTerm); 
      console.log('Value assigned tosetSearchTerm is = ' + setSearchTerm); 

      /*
       To gain control over the list, make it stateful by using it as initial 
       state in React's useState Hook. The returned values from the array are 
       the current state (stories) and the state updater function (setStories):
      */
      const [stories, setStories] = React.useState(initialStories);

      /*
       Next write and event handler which removes an item from list
      */
      const handleRemoveStory = (item) => {
        const newStories = stories.filter(
          (story) => item.objectID !== story.objectID
        );
        setStories (newStories);
      }
      const handleSearch = (event) => {
          setSearchTerm(event.target.value); 
        };

      const searchedStories = stories.filter((story) =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
     
      return (
        <>
          <h1>My Hacker Stories</h1>
    
           <InputWithLabel
             id="search"
             //label="Search:"
             value={searchTerm} //assign name of stateful value created by call to useState() hook
             isFocused //pass imperatively a dedicated  prop. isFocused as an attribute is equivalent to isFocused={true}
             onInputChange={handleSearch} //assign name of callback handler
            >
              <strong>Search:</strong>Search: 
             </InputWithLabel>
            
          <hr />
    
          <List list={searchedStories} onRemoveItem = {handleRemoveStory}/>
        </>
      );
    }
    
    const InputWithLabel = ({
       id,
       value,          //this prop was assigned {searchTerm}
       type = 'text',
       onInputChange, //this prop was assigned {handleSearch} the callback
       isFocused,
       children,
      }) => { 
        const inputRef = React.useRef();

        React.useEffect(() => {
          if (isFocused && inputRef.current) {
            inputRef.current.focus();
          }
        }, [isFocused]);

        return (
          <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input
              ref={inputRef}
              id={id}
              type={type}
              value={value}
              onChange={onInputChange}
            />
          </>
        );
    };
    
   const List = ({list, onRemoveItem}) => ( 
    <ul>
       {list.map((item) => (
         <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
       ))}
    </ul>
  ); //EOF
     
 
  /*
   Finally, the Item component uses the incoming callback handler as a 
   function in a new handler. In this handler, we will pass the specific 
   item to it. Moreover, an additional button element is needed to trigger 
   the actual event:

    
   One popular solution is to use an inline arrow function, 
   which allows us to sneak in arguments like the item:
  <button type="button" onClick={() => onRemoveItem(item)}> 
        Dismiss
   </button>
 
  */
  const Item = ({item}) => (   
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
      <button type="button" onClick={() => onRemoveItem(item)}> 
         Dismiss
      </button>
      </span>
    </li>
  );   

    
export default App;

//========================================================== 
//Note on Map:
 //Within the map() method, we have access to each object and its properties.
 
 //useState
 //By using useState, we are telling React that we want to have a 
 //stateful value which changes over time. And whenever this stateful value 
 //changes, the affected components (here: Search component) 
 //will re-render to use it (here: to display the recent value).