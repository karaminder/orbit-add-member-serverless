require('dotenv').config()
const fetch = require('node-fetch').default

const handler = async (event) => {
  try {
    const { source, username, tags='' } = event.queryStringParameters

    const apiKey = event.headers['x-api-key']

    if (!apiKey) return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Missing API key'
      })
    }
    if (source === '' || username === '') return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Need both Source and username'
      })
    }
    


    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        identity: {
          source: source.toLowerCase(),
          username
        },
        member: {
          tags_to_add: tags
        }
      })
    };
    
    const response = await fetch(`https://app.orbit.love/api/v1/${process.env.ORBIT_WORKSPACE}/members`, options)
    const json = await response.json()

    if (json.error) throw new Error(json.error)

    const member = json.data
    const { id, attributes } = member
    const { name } = attributes
    console.log(json)
    const successMessage = {
      message: `Successfully added ${name} to the Orbit member list with id of ${id}`,
      url: `https://app.orbit.love/${process.env.ORBIT_WORKSPACE}/members/${id}`
    }
      

    return {
      statusCode: 200,
      body: JSON.stringify(successMessage),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
