import Site from '@/models/site';
import { toast } from 'react-toastify';
import { ISitesSummary } from './ssp-default';
import connectMongo from './mongoose';
import { preview } from './preview';
import { ISite } from '@/pages/api/site/types';

/**
 * Fetch the customer sites by customer id.
 * TODO pull site names array and full data on demand.
 * @param customerId
 * @returns
 */
export const fetchCustomerSites = async (email: string) => {
  await connectMongo();

  const sites: ISitesSummary[] = await Site.find({ customerEmail: email });
  const sitesRes = sites.map((val) => {
    return {
      _id: val._id.toString(),
      title: val.title
    };
  });
  return sitesRes;
};

/**
 * Fetch the site
 */
export const fetchCustomerSite = async (siteId: string) => {
  await connectMongo();
  return await Site.findById(siteId).select('-__v');
};

/**
 * Add a new site.
 * @param siteTitle
 * @returns
 */
export const addNewSite = async (siteTitle: string) => {
  const res = await fetch(`/api/site`, {
    method: 'PUT',
    body: JSON.stringify({ title: siteTitle })
  });

  const fetchRes = await res.json();

  return fetchRes;
};

/**
 * Remove a site.
 * @param siteId
 * @returns
 */
export const removeSite = async (siteId: string) => {
  const res = await fetch(`/api/site/${siteId}`, {
    method: 'DELETE'
  });

  const json = await res.json();

  if (json.success) {
    toast.success('Site was removed!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true
    });

    return json.data;
  } else {
    toast.error('Ooops! Site was not removed. ' + json.message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true
    });

    return null;
  }
};

export const saveSite = async (config: ISite) => {
  preview(config);

  const res = await fetch(`/api/site/${config._id}`, {
    method: 'PUT',
    body: JSON.stringify(config)
  });

  const json = await res.json();

  if (json.success) {
    toast.success('Saved!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true
    });

    return json.data;
  } else {
    toast.error('Ooops! Could not save!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true
    });

    return null;
  }
};

export const publishSite = async (siteId: string) => {
  const res = await fetch(`/api/site/${siteId}/publish`, {
    method: 'POST'
  });

  const json = await res.json();

  if (json.success) {
    toast.success('Site was published! Time to deploy!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true
    });

    return json.data;
  } else {
    toast.error('Oops... could not publish site!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true
    });

    return null;
  }
};
