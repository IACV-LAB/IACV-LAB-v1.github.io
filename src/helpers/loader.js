const DOC_ID = '1j2mNAsbnqMz3R1hI2dSLrnjWVlFSUc9DcIcAoJygrrI'
const API_KEY = 'AIzaSyAv0y_ksEsnew7fKtg9AyMKnReZ9rjPdfM'

import sheets from '@/helpers/sheets'
sheets.setKey(API_KEY)

export async function loadData() {
  const ranges = [
    'Announcements!A2:C',
    'Members!A2:H',
    'Research!A2:F',
    'Tags!A2:F',
    'Links!A2:G',
    'Redirections!A2:B',
  ]
  const response = await sheets.getRanges(DOC_ID, ranges)
  const valueRanges = response.valueRanges
  const announcements = getAnnouncementsFromValues(valueRanges[0].values)
  const members = getMembersFromValues(valueRanges[1].values)
  const research = getResearchFromValues(valueRanges[2].values)
  const tags = getTagsFromValues(valueRanges[3].values)
  const links = getLinksFromValues(valueRanges[4].values)
  const redirections = getRedirectionsFromValues(valueRanges[5].values)
  return { announcements, members, research, tags, links, redirections }
}

function getAnnouncementsFromValues(values) {
  const announcements = []
  const now = new Date()
  for (let row of values) {
    const expireAt = row[2] ? new Date(Date.parse(row[2])) : null
    if (!row[1]) {
      continue
    } else if (expireAt && (expireAt < now)) {
      continue
    }
    announcements.push({
      title: row[0],
      content: row[1]
    })
  }
  return announcements
}

function getMembersFromValues(values) {
  const groups = []
  let group = null
  for (let row of values) {
    const title = row[0]
    if (!group || (group.title !== title)) {
      if (group) {
        groups.push(group)
      }
      group = { title, members: [] }
    }
    group.members.push({
      name: row[1],
      email: row[2],
      image: row[3],
      description: row[4],
      links: row[5],
      degree: row[6],
      year: row[7]
    })
  }
  if (group) {
    groups.push(group)
  }
  return groups
}

 function getResearchFromValues(values) {
  const categories = []
  let category = null
  for (let row of values) {
    const title = row[0]
    if (!category || (category.title !== title)) {
      if (category) {
        categories.push(category)
      }
      category = { title, items: [] }
    }
    category.items.push({
      title: row[1],
      authors: row[2],
      booktitle: row[3],
      links: row[4],
      tags: (row[5] || '').split(',').map(tag => tag.trim())
    })
  }
  if (category) {
    categories.push(category)
  }
  return categories
}

function getTagsFromValues(values) {
  const tags = {}
  for (let row of values) {
    const tagId = row[0]
    tags[tagId] = {
      title: row[1],
      tag: row[2],
      color: row[3]
    }
  }
  return tags
}

function getLinksFromValues(values) {
  const groups = []
  let group = null
  for (let row of values) {
    const category = row[0]
    if (!group || (group.category !== category)) {
      if (group) {
        groups.push(group)
      }
      group = { category, links: [] }
    }
    group.links.push({
      title: row[1],
      fullTitle: row[2],
      url: row[3],
      query: row[4],
      callMonth: row[5],
      eventMonth: row[6]
    })
  }
  if (group) {
    groups.push(group)
  }
  return groups
}

function getRedirectionsFromValues(values) {
  const redirections = {}
  for (const row of values) {
    const src = row[0].trim()
    redirections[src] = row[1]
  }
  return redirections
}
