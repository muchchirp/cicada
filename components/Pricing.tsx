'use client';

import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Session, User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({
  session,
  user,
  products,
  subscription
}: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/signin');
    }
    if (price.product_id === subscription?.prices?.products?.id) {
      return router.push('/account');
    }
    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!products.length)
    return (
      <section>
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>
    );

  if (products.length === 1)
  
  return (
      <section className="">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              Pricing Plans...
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
              Start building for free, then add a site plan to go live. Account
              plans unlock additional features.
            </p>
            <div className="relative flex self-center mt-12 border rounded-lg bg-zinc-900 border-zinc-800">
              <div className="border border-pink-500 border-opacity-50 divide-y rounded-lg shadow-sm bg-zinc-900 divide-zinc-600">
                <div className="p-6 py-2 m-1 text-2xl font-medium text-white rounded-md shadow-sm border-zinc-800 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8">
                  {products[0].name}
                </div>
              </div>
            </div>
            <div>
              {products[0].prices?.map((price) => {
                const priceString =
                  price.unit_amount &&
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0
                  }).format(price.unit_amount / 100);

                return (
                  <div
                    key={price.interval}
                    className="divide-y rounded-lg shadow-sm divide-zinc-600 bg-zinc-900"
                  >
                    <div className="p-6">
                      <p>
                        <span className="text-5xl font-extrabold white">
                          {priceString}
                        </span>
                        <span className="text-base font-medium text-zinc-100">
                          /{price.interval}
                        </span>
                      </p>
                      <p className="mt-4 text-zinc-300">{price.description}</p>
                      <Button
                        variant="slim"
                        type="button"
                      //  disabled={false}
                        loading={priceIdLoading === price.id}
                        onClick={() => handleCheckout(price)}
                        className="block w-full py-2 mt-12 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 "
                      >
                        {products[0].name ===
                        subscription?.prices?.products?.name
                          ? 'Manage'
                          : 'Subscribe'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <LogoCloud />
        </div>
      </section>
    );

    if (products.length === 3)
//ACTIVE OFFER MONTHLY ANNUAL SWITCH
    return (
    <section className="">
      <div className="max-w-6xl px-4 py-2 mx-auto sm:py-2 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <p className="max-w-2xl m-auto mt-5 text-center text-xl text-black sm:text-center sm:text-xl">
            Add a plan to go live, cancel any time via stripe. Join the VPN service powered by&nbsp;
            
            <a
              className="text-pink-500 underline"
              href="https://unblockvpn.io/about/trust"
              rel="noopener noreferrer"
              target="_blank"
            >
               industry leading encryption
            </a>.
          </p>
          <div className="relative self-center mt-6 bg-zinc-900 text-white rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
            {intervals.includes('month') && (
              <button
                onClick={() => setBillingInterval('month')}
                type="button"
                className={`${
                  billingInterval === 'month'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Monthly billing
              </button>
            )}
            {intervals.includes('year') && (
              <button
                onClick={() => setBillingInterval('year')}
                type="button"
                className={`${
                  billingInterval === 'year'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Yearly billing
              </button>
            )}
          </div>
        </div>




        {/* ACTIVE OFFER */}
       
        <div className="relative flex flex-col mt-12 mx-auto w-12/12 sm:w-8/12 max-w-2xl gap-8 justify-center items-center sm:justify-start sm:grid sm:grid-cols-1">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                  {
                    'border border-pink-500': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Family'
                  }
                )}
              >
                <div className="p-6">

                <div className="w-32 h-8 rounded-md mb-2 font-semibold bg-blue-600 text-white flex items-center justify-center text-white">
                    1 month free
                  </div>
                  
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {product.name}
                  </h2>

                  <p className="mt-2">
                    <span className="text-white white">
                      {priceString} 
                    </span>
                    <span className="text-white text-base font-medium">
                      /{billingInterval} after offer period
                    </span>
                  </p>
                  <p className="mt-4 text-white text-zinc-300">{product.description}</p>
                 

                  <div className="mt-4 w-9/10 h-px bg-gray-300"></div>


                  <ul className="flex flex-col gap-4 mt-6">
                    <li className="flex items-center space-x-2">
                      <div className="w-6 h-6">
                        <svg
                          role="img"
                          focusable="false"
                          height="24"
                          width="24"
                          viewBox="0 0 24 24"
                          aria-label=""
                          className="text-white stroke-current"
                        >
                          <polyline points="3.32 12.86 8.9 19.4 20.99 5.26" fill="none" stroke="#ffffff"></polyline>
                        </svg>
                      </div>
                      <p className="text-white">Stream like a local</p>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-6 h-6">
                        <svg
                          role="img"
                          focusable="false"
                          height="24"
                          width="24"
                          viewBox="0 0 24 24"
                          aria-label=""
                          className="text-white stroke-current"
                        >
                          <polyline points="3.32 12.86 8.9 19.4 20.99 5.26" fill="none" stroke="#ffffff"></polyline>
                        </svg>
                      </div>
                      <p className="text-white">Connect from anywhere</p>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-6 h-6">
                        <svg
                          role="img"
                          focusable="false"
                          height="24"
                          width="24"
                          viewBox="0 0 24 24"
                          aria-label=""
                          className="text-white stroke-current"
                        >
                          <polyline points="3.32 12.86 8.9 19.4 20.99 5.26" fill="none" stroke="#ffffff"></polyline>
                        </svg>
                      </div>
                      <p className="text-white">Full privacy</p>
                    </li>
                  </ul>
                  <Button
                    variant="slim"
                    type="button"
                 //   disabled={!session}
                    loading={priceIdLoading === price.id}
                    onClick={() => handleCheckout(price)}
                    className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                  >
                    {product.name === subscription?.prices?.products?.name
                      ? 'Manage'
                      : 'Subscribe'}
                  </Button>


                  <p className="mt-2">
                    <span className="text-white text-base text-xs font-medium">
                    Terms and conditions apply. 1 month free not available for users who have already tried Premium.
                    </span>
                  </p>                 
                </div>
              </div>     
            );
          })}
        </div>
        
{/* ACTIVE OFFER END */}

        <LogoCloud />

      </div>
    </section>
    )
};






function LogoCloud() {
  return (
    <div>
      <p className="mt-12 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
        Brought to you by
      </p>
      <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
        <div className="flex items-center justify-start">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <img
              src="/nextjs.svg"
              alt="Next.js Logo"
              className="h-12 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="h-6 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://stripe.com" aria-label="stripe.com Link">
            <img
              src="/stripe.svg"
              alt="stripe.com Logo"
              className="h-12 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://supabase.io" aria-label="supabase.io Link">
            <img
              src="/supabase.svg"
              alt="supabase.io Logo"
              className="h-10 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://github.com" aria-label="github.com Link">
            <img
              src="/github.svg"
              alt="github.com Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
      </div>
      
    </div>
  );
}
