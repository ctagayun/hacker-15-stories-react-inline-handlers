/*================================================================
 Inline Handlers
   Task: The application renders a list of items and allows its 
  users to filter the list via a search feature. Next the application 
  should render a button next to each list item which allows its users 
  to remove the item from the list.. 

  Test
  Sub Tasks:
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

    /*
      At the moment initialStories is unstateful variable
      To gain control over the list, lets make it stateful.
      By using it as initial state in React's useState Hook. The 
      returned values from the array are the current state (stories) 
      and the state updater function (setStories):
    */
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

  /* This is a custom hook that will store the state in a 
     local storage. useStorageState which will keep the component's 
     state in sync with the browser's local storage.

    This custom hook returns
      1. state 
      2. and a state updater function
    and accepts an initial state as argument. 

     This is the custom hook before it was refactored to make it generic:
     const [searchTerm, setSearchTerm] = React.useState(''); 
        1. searchTerm renamed to 'value'
        2. setSearchTerm renamed to 'setValue'
  */
  const useStorageState = (key, initialState) => {
     const [value, setValue] = React.useState(
        localStorage.getItem('key') || initialState 
     );
     
     React.useEffect(() => {
       console.log('useEffect fired. Displaying value of dependency array ' + [ value, key]  );
         localStorage.setItem(key, value);  
        },
        [value, key]   //Dependency array
        ); //EOF useEffect
    
     //the returned values are returned as an array.
     return [value, setValue]; 

  } //EOF create custom hook
  
 const App = () => { 
      /* 
      Call custom useStorageState hook to assign value to searchTerm, 
      setSearchTerm
      */
      const [searchTerm, setSearchTerm] =  useStorageState (
        'search', //key
        'React',  //Initial state
        );
      console.log('Value assigned to search term is = ' + searchTerm); 
      console.log('Value assigned tosetSearchTerm is = ' + setSearchTerm); 

      /* Step 1:
         To gain control over the stories, make it stateful by using it as initial 
       state in React's useState Hook. The returned values from the array are 
       the current state (stories) and the state updater function (setStories):
      */
      const [stories, setStories] = React.useState(initialStories);

      /* Step 2: Next we write event handler which removes an item from list
         Select the record from the state called 'stories' based on the filter
         Here, the JavaScript array's built-in filter method creates
         a new filtered array called 'story'.

          The filter() method takes a function as an argument, 
        which accesses each item in the array and returns /
        true or false. If the function returns true, meaning the condition is 
        met, the item stays in the newly created array; if the function 
        returns false, it's removed from the filtered array.

         Pass this handler to List component when instantiating the component
       
        */
      const handleRemoveStory = (item) => { 
        const newStories = stories.filter(   
          (story) => item.objectID !== story.objectID
        );
        //updater function updates the stateful variable 
        //called 'stories'. Since the state has changed
        //(e.g an item was deleted), the App, List, Item
        //components will re-render
        setStories(newStories);
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
    
   /*
     Instantiate Item component. Pass three props:
       1. objectID 2. Item 3. onRemoveItem prop which was assigned 
          the callback handler 'handleRemoveStory'
     <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}
     
     Finally, the Item component uses the incoming callback handler 
     as a function in a new handler. In this handler, we will pass the 
     specific item to it. 
     
     Moreover, an additional button element is needed to trigger
     the actual event:

   */
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
  const Item = ({item, onRemoveItem}) => (   
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

 /* 
     The filter() method takes a function 
        as an argument, which accesses each item in the array and returns /
        true or false. If the function returns true, meaning the condition is 
        met, the item stays in the newly created array; if the function 
        returns false, it's removed from the filtered array.

 */