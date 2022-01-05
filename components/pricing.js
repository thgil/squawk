/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon, CheckIcon, PlusIcon, RssIcon, NewspaperIcon, ViewListIcon, BookOpenIcon, VideoCameraIcon } from '@heroicons/react/outline'
import EmailDialog from '../components/emaildialog'

const features = [
  {
    name: 'Audiobook',
    icon: BookOpenIcon,
    description:
      '<audio controls><source src="https://pollysquawk.s3.amazonaws.com/1641222291288.mp3" type=\"audio/mpeg\" /></audio>',
  },
  {
    name: 'Video',
    icon: VideoCameraIcon,
    description:
      '<audio controls><source src="https://pollysquawk.s3.amazonaws.com/1641221687729.mp3" type="audio/mpeg" /></audio>',
  },
  {
    name: 'Article',
    icon: NewspaperIcon,
    description:
      '<audio controls><source src="https://pollysquawk.s3.amazonaws.com/1641222126616.mp3" type="audio/mpeg" /></audio>',
  },
  {
    name: 'News',
    icon: RssIcon,
    description:
      '<audio controls><source src=\"https://pollysquawk.s3.amazonaws.com/1641165785405.mp3\" type=\"audio/mpeg\" /></audio>',
  },
]

const checklist = [
  'Pay as you go',
  'More voices',
  'Narration editor',
  'No text limit',
  'Cancel any time',
  'Narrate anything',
]

export default function Pricing() {
  return (
    <div className="relative bg-white" id="pricing">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-indigo-700" />
      </div>
      <div className="relative max-w-7xl mx-auto lg:px-8 lg:grid lg:grid-cols-2">
        <div className="bg-white py-16 px-4 sm:py-24 sm:px-6 lg:px-0 lg:pr-8">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">Examples</h2>
            <p className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Narrate your text now
            </p>
            <dl className="mt-12 space-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute h-12 w-12 flex items-center justify-center bg-indigo-500 rounded-md">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500" dangerouslySetInnerHTML={{__html: feature.description}}></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="bg-indigo-700 py-16 px-4 sm:py-24 sm:px-6 lg:bg-none lg:px-0 lg:pl-8 lg:flex lg:items-center lg:justify-end">
          <div className="max-w-lg mx-auto w-full space-y-8 lg:mx-0">
            <div>
              <h2 className="sr-only">Price</h2>
              <p className="relative grid grid-cols-2">
                <span className="flex flex-col text-center">
                  <span className="text-5xl font-extrabold text-white tracking-tight">$5</span>
                  <span className="mt-2 text-base font-medium text-indigo-200">Setup fee<br />One time cost</span>
                  <span className="sr-only">plus</span>
                </span>
                <span
                  className="pointer-events-none absolute h-12 w-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <PlusIcon className="h-6 w-6 text-indigo-300" aria-hidden="true" />
                </span>
                <span>
                  <span className="flex flex-col text-center">
                    <span className="text-5xl font-extrabold text-white tracking-tight">$0.10</span>
                    <span className="mt-2 text-base font-medium text-indigo-200">Per minute of speech.<br />About 1000 characters.</span>
                  </span>
                </span>
              </p>
            </div>
            <ul role="list" className="rounded overflow-hidden grid gap-px sm:grid-cols-2">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="bg-indigo-800 bg-opacity-50 py-4 px-4 flex items-center space-x-3 text-base text-white"
                >
                  <CheckIcon className="h-6 w-6 text-indigo-300" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <EmailDialog class="bg-white border border-transparent rounded-md w-full px-8 py-4 flex items-center justify-center text-lg leading-6 font-medium text-indigo-600 hover:bg-indigo-50 md:px-10"></EmailDialog>
            <a href="#" className="block text-center text-base font-medium text-indigo-200 hover:text-white">
              Try Squawk now.
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
