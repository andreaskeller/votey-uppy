import classNames from 'classnames';
import Link from 'next/link';
import { Item as ItemInterface } from 'services/data-types';
import { useAddVote, useRemoveVote } from 'services/api-hooks';
import { useSession } from 'next-auth/client';

export default function Item({ item }: { item: ItemInterface }) {
  const [session] = useSession();

  const hasVoted =
    item.votes.find((vote) => vote.userId === session?.user._id) != null;
  const isAdmin = session?.user.role === 'admin';

  const [addVote, addData] = useAddVote(item._id);
  const [removeVote, removeData] = useRemoveVote(item._id);

  const isLoading = addData.isLoading || removeData.isLoading;

  return (
    <div className="border border-gray-400 rounded-md shadow p-4 flex flex-col sm:flex-row hover:border-gray-500 ease-linear transition duration-150">
      <div data-testid="vote-wrapper" className="mx-auto pr-4 text-center">
        <button
          className={classNames('text-4xl align-top sm:-mt-1 cursor-pointer', {
            'animate-ping': isLoading,
          })}
          onClick={hasVoted ? removeVote : addVote}
          disabled={isLoading}
        >
          {hasVoted ? '✅' : '⬆️'}
        </button>
        <div className="border border-blue-800 bg-blue-300 rounded">
          {item.votes.length}
        </div>
      </div>
      <div className="content flex-grow">
        <div className="relative font-bold text-xl leading-7">
          <Link href="/item/[...itemId]" as={`/item/${item._id}`}>
            <a>{item.title}</a>
          </Link>
          {isAdmin && (
            <Link href="/item/[...itemId]" as={`/item/${item._id}/edit`}>
              <a>
                <button className="absolute right-0">✎</button>
              </a>
            </Link>
          )}
        </div>
        <div className="py-2">{item.description}</div>
        <div className="metadata text-gray-700 text-sm space-x-2">
          <span className="inline-block">{item.category}</span>
          <span>{item.created}</span>
          <span>{item.status}</span>
        </div>
      </div>
    </div>
  );
}