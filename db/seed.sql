-- Insert test chats for user_2mnvu38xwiX8w2qSYrj25kf9vlI
INSERT INTO chats (user_id, name, created_at)
VALUES 
  ('user_2mnvu38xwiX8w2qSYrj25kf9vlI', 'AI and Machine Learning', NOW()),
  ('user_2mnvu38xwiX8w2qSYrj25kf9vlI', 'Web Development Trends', NOW()),
  ('user_2mnvu38xwiX8w2qSYrj25kf9vlI', 'Cybersecurity Best Practices', NOW());

-- Get the IDs of the inserted chats
WITH inserted_chats AS (
  SELECT id FROM chats
  WHERE user_id = 'user_2mnvu38xwiX8w2qSYrj25kf9vlI'
  ORDER BY created_at DESC
  LIMIT 3
)

-- Insert test messages for each chat
INSERT INTO messages (chat_id, role, content, created_at)
SELECT 
  ic.id,
  m.role::role,
  m.content,
  NOW()
FROM inserted_chats ic
CROSS JOIN LATERAL (
  VALUES 
    ('user', 'What are the latest trends in AI?'),
    ('assistant', 'Some of the latest trends in AI include large language models, generative AI, and reinforcement learning.'),
    ('user', 'Can you explain more about generative AI?'),
    ('assistant', 'Generative AI refers to AI systems that can create new content, such as text, images, or music. Examples include GPT-3 for text and DALL-E for images.')
) AS m(role, content)
WHERE ic.id = (SELECT id FROM inserted_chats LIMIT 1 OFFSET 0)

UNION ALL

SELECT 
  ic.id,
  m.role::role,
  m.content,
  NOW()
FROM inserted_chats ic
CROSS JOIN LATERAL (
  VALUES 
    ('user', 'What are some popular frontend frameworks in 2023?'),
    ('assistant', 'Popular frontend frameworks in 2023 include React, Vue.js, Angular, and Svelte. Next.js, a React framework, is also gaining popularity for its server-side rendering capabilities.')
) AS m(role, content)
WHERE ic.id = (SELECT id FROM inserted_chats LIMIT 1 OFFSET 1)

UNION ALL

SELECT 
  ic.id,
  m.role::role,
  m.content,
  NOW()
FROM inserted_chats ic
CROSS JOIN LATERAL (
  VALUES 
    ('user', 'What are some essential cybersecurity practices for small businesses?'),
    ('assistant', 'Essential cybersecurity practices for small businesses include: regular software updates, strong password policies, employee training, data encryption, and regular backups.'),
    ('user', 'How often should we conduct security audits?'),
    ('assistant', 'It''s recommended to conduct security audits at least annually, but more frequent audits (e.g., quarterly) can help identify and address vulnerabilities more quickly.')
) AS m(role, content)
WHERE ic.id = (SELECT id FROM inserted_chats LIMIT 1 OFFSET 2);