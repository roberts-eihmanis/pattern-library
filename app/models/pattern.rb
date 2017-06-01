class Pattern < ApplicationRecord
  has_many :pattern_colors

  def self.search(search)
    scope = all
    if search
      scope.where(row_number: search)
    else
      scope
    end
  end
end