import { Tab } from '@headlessui/react'
import { AtSymbolIcon, CodeIcon, LinkIcon } from '@heroicons/react/solid'

import { useState, useEffect } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function InputArea(props) {
  const [ audioString, setAudioString ] = useState('');
  const [ cost, setCost ] = useState(0);
  const [ audioUrl, setAudioUrl ] = useState('');
  const [ error, setError ] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    setAudioString(e.target.value);
    setCost(Math.ceil(e.target.value.length/1000 * 3));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(audioString);

    const mod = '<speak>'+audioString+'</speak>'

    const res = await fetch(`http://localhost:3000/api/speak`, {
      method: 'POST',
      mode: 'cors',
      SameSite: 'Strict',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audioString: mod
      })
    });

    const result = await res.json();

    if(result.message) return setError(result.message);
    setAudioUrl(result.url);

    props.onAudioUrl(result.url);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex items-center">
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'px-3 py-1.5 border border-transparent text-sm font-medium rounded-md'
                  )
                }
              >
                Write
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'ml-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md'
                  )
                }
              >
                Adjust
              </Tab>

              {/* These buttons are here simply as examples and don't actually do anything. */}
              {selectedIndex === 0 ? (
                <div className="ml-auto flex items-center space-x-5">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Insert link</span>
                      <LinkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Insert code</span>
                      <CodeIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Mention someone</span>
                      <AtSymbolIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                <label htmlFor="comment" className="sr-only">
                  Comment
                </label>
                <div>
                  <textarea
                    rows={5}
                    name="comment"
                    id="comment"
                    className="p-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm ring-1 border-gray-300 outline-1 rounded-md"
                    placeholder="Add your text..."
                    value={audioString}
                    onChange={handleChange}
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                <div className="border-b">
                  <div className="mx-px mt-px px-4 pt-4 pb-12 text-sm leading-5 text-gray-800">
                    <p>This feature is not ready yet.</p>
                    <p>Allows you to add pauses, intonations, control volume and other effects throughout the text.</p>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
      <div className="mt-2 flex justify-end items-center">
        { error && (<div className='text-sm text-red-500'>{error}</div>)}
        <span className="text-sm mx-5">{audioString.length} / 250 characters </span>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate audio {cost == 0 ? '': `\$${(cost/100).toPrecision(1)}`}
        </button>
      </div>
    </form>
  )
}
