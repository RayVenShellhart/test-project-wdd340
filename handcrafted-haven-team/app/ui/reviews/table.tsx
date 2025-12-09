import Image from 'next/image';
import { playfairDisplay } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  ReviewsTableType,
  FormattedReviewsTable,
} from '@/app/lib/definitions';

export default async function ReviewsTable({
  reviews,
}: {
  reviews: FormattedReviewsTable[];
}) {
  return (
    <div className="w-full">
      <h1 className={`${playfairDisplay.className} mb-8 text-xl md:text-2xl`}>
        Reviews
      </h1>
      <Search placeholder="Search reviews..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {reviews?.map((review) => (
                  <div
                    key={review.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-gray-500">Review ID: {review.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-full flex-col">
                        <p className="font-medium">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Review ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Content
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {reviews.map((review) => (
                    <tr key={review.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{review.id}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {review.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}