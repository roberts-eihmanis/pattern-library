class CreateMessage < ActiveRecord::Migration[5.0]
  def change
    create_table :messages do |t|
      t.string :title
      t.string :name
      t.string :surname
      t.string :email
      t.text :text
    end
  end
end
