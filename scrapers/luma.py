# Install with pip install firecrawl-py
import asyncio
from firecrawl import AsyncFirecrawlApp, JsonConfig
from pydantic import BaseModel
import yaml
from datetime import datetime
import re
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class LinksSchema(BaseModel):
    links: list[str]

class HackathonSchema(BaseModel):
    name: str
    date: str
    location: str
    category: str
    website: str

async def extract_hackathon_info(app: AsyncFirecrawlApp, url: str) -> Optional[Dict[str, str]]:
    json_config = JsonConfig(
        schema=HackathonSchema
    )
    
    try:
        response = await app.scrape_url(
            url=url,
            formats=['json'],
            json_options=json_config,
            only_main_content=True,
            timeout=120000
        )
        
        print(f"\nRaw response for {url}:")
        print(response.json)
        
        # Generate an ID from the URL
        id_match = re.search(r'lu\.ma/([^/]+)', url)
        hackathon_id = id_match.group(1) if id_match else url.split('/')[-1]
        
        if response.json:
            return {
                'id': hackathon_id,
                'name': response.json.get('name', ''),
                'date': response.json.get('date', ''),
                'location': response.json.get('location', ''),
                'category': response.json.get('category', ''),
                'website': url,
            }
        return None
    except Exception as e:
        print(f"Error processing {url}: {str(e)}")
        return None

async def main():
    app = AsyncFirecrawlApp(api_key=os.getenv('FIRECRAWL_API_KEY'))
    
    # First get all hackathon links
    json_config = JsonConfig(
        schema=LinksSchema
    )
    
    response = await app.scrape_url(
        url='https://lu.ma/tech-europe',		
        formats=['json'],
        json_options=json_config,
        only_main_content=True,
        timeout=120000
    )
    
    print("Raw response:")
    print(response.json)
    
    hackathons_data = []
    if isinstance(response.json, dict) and 'links' in response.json:
        hackathon_links = [
            link for link in response.json['links']
            if 'hackathon' in link.lower() and 'lu.ma' in link
        ]
        
        print("\nFound hackathon links:")
        for link in hackathon_links:
            print(link)
            
        # Process each hackathon link
        print("\nExtracting information from each hackathon...")
        for link in hackathon_links:
            hackathon_info = await extract_hackathon_info(app, link)
            if hackathon_info:
                hackathons_data.append(hackathon_info)
        
        # Save to YAML file
        if hackathons_data:
            print("\nSaving hackathons data...")
            with open('../data/hackathons.yml', 'a', encoding='utf-8') as f:
                yaml.dump(hackathons_data, f, allow_unicode=True, sort_keys=False)
            print("Data saved successfully!")
        else:
            print("No hackathon data was collected.")
    else:
        print("\nNo links found in the response or unexpected response format")

asyncio.run(main())