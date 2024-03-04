import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("https://backend.0xppl.com/api/v4/get_feed_item?pusher_channel_id=c5e0f92b-c0eb-4a27-9af3-87816923074b",
          { "id": "1708862399_1708948799_47965", "type": "activity_group" });
        setData(response.data);
        console.log('Fetched data:', response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  const nestedSummary = data && data.data && data.data.summary && data.data.summary.summary;
  console.log(nestedSummary);



  const renderContent = (content) => {
    const replacedContent = content.replace(/{{(.*?)}}/g, (match, p1) => {
      const [type, key] = p1.split('||');

      switch (type) {
        case 'token_out':
          return `<img src= ${data.data.profiles[key].display_picture} width="16px" height="16px">
<b>${data.data.profiles[key].token_details.symbol}</b>`;
        case 'contract':
          return `<img src= ${data.data.profiles[key].display_picture} width="16px" height="16px">
<b>${data.data.profiles[key].protocol_details.name}</b>`;
        case 'gpt_prompt':
          return '';
        case 'person':
          return `<img src= ${data.data.profiles[key].display_picture} width="16px" height="16px">
<b>${data.data.profiles[key].socials.twitter}</b>`;
        case 'token':
          return `<img src= ${data.data.profiles[key].display_picture} width="16px" height="16px">
<b>${data.data.profiles[key].token_details.symbol}</b>`;
        case 'break_line':
          return '<br/>';
        default:
          return match;
      }
    });

    return <div dangerouslySetInnerHTML={{ __html: replacedContent }} />;
  };

  return (
    <div className='App'>
      {nestedSummary ? (
        <div>{renderContent(nestedSummary)}</div>
      ) : (
        <p>No summary content found.</p>
      )}
    </div>
  );
};

export default MyComponent;